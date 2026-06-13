import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const DISCORD_PUBLIC_KEY = Deno.env.get('DISCORD_PUBLIC_KEY')
const DISCORD_BOT_TOKEN = Deno.env.get('DISCORD_BOT_TOKEN')
const DISCORD_STAFF_CHANNEL_ID = Deno.env.get('DISCORD_STAFF_CHANNEL_ID')
const DISCORD_GUILD_ID = Deno.env.get('DISCORD_GUILD_ID')
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

async function verifyDiscordRequest(raw: string, sig: string, ts: string, key: string): Promise<boolean> {
  try {
    const k = await crypto.subtle.importKey('raw', hexToUint8Array(key), { name: 'Ed25519' }, false, ['verify'])
    return await crypto.subtle.verify({ name: 'Ed25519' }, k, hexToUint8Array(sig), new TextEncoder().encode(ts + raw))
  } catch { return false }
}

async function discordPost(channelId: string, payload: unknown) {
  if (!DISCORD_BOT_TOKEN) return
  await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

async function handleApprove(projectId: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single()
  if (!project) return

  const channelName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100)

  // Create Discord channel
  const channelRes = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/channels`, {
    method: 'POST',
    headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: channelName,
      type: 0,
      topic: `${project.client_name} — ${project.name}`,
    }),
  })
  const channel = await channelRes.json()
  const channelId = channel.id as string

  // Update project with channel
  await supabase.from('projects').update({ status: 'approved', discord_channel_id: channelId, updated_at: new Date().toISOString() }).eq('id', projectId)

  // Welcome message in new channel
  await discordPost(channelId, {
    content: `## 🚀 Project: ${project.name}\n\n**Client:** ${project.client_name}\n**Email:** ${project.client_email}\n\n✅ Approved. All communication logged here.`,
  })

  // AI draft welcome email
  let welcomeText = ''
  if (OPENROUTER_API_KEY) {
    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are SYNDRIX client onboarding. Draft warm, professional replies. Sign as "Team SYNDRIX".' },
          { role: 'user', content: `Draft welcome email for ${project.client_name} regarding "${project.name}". Thank them, acknowledge their project, propose next steps. 3-4 paragraphs.` },
        ],
        max_tokens: 500,
      }),
    })
    const aiData = await aiRes.json()
    welcomeText = aiData.choices?.[0]?.message?.content || ''
  } else {
    welcomeText = `Hello ${project.client_name},\n\nThank you for reaching out about "${project.name}". We're excited to explore how SYNDRIX can help bring your project to life.\n\nOur team will review the details and get back to you shortly with next steps.\n\nBest regards,\nTeam SYNDRIX`
  }

  // Send email via Resend
  if (RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'SYNDRIX <hello@syndrixoff.com>',
        to: project.client_email,
        subject: `Re: ${project.name} — Next Steps`,
        text: welcomeText,
      }),
    })
  }

  // Log
  await supabase.from('project_updates').insert({ project_id: projectId, content: 'Project approved — welcome email sent, Discord channel created.', update_type: 'email_sent' })

  // Notify staff channel
  await discordPost(DISCORD_STAFF_CHANNEL_ID!, {
    content: `✅ **${project.name}** approved. Channel <#${channelId}> created. Welcome email sent to ${project.client_email}.`,
  })
}

async function handleReject(projectId: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single()
  if (!project) return

  await supabase.from('projects').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', projectId)

  // AI draft rejection
  let rejectText = ''
  if (OPENROUTER_API_KEY) {
    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are SYNDRIX client communication. Draft polite, gracious decline replies. Sign as "Team SYNDRIX".' },
          { role: 'user', content: `Draft polite decline email for ${project.client_name} regarding "${project.name}". Thank them, politely decline (capacity), leave door open. 2-3 paragraphs.` },
        ],
        max_tokens: 400,
      }),
    })
    const aiData = await aiRes.json()
    rejectText = aiData.choices?.[0]?.message?.content || ''
  } else {
    rejectText = `Hello ${project.client_name},\n\nThank you for your interest in SYNDRIX and for sharing details about "${project.name}". After careful consideration, we regret to inform you that we are unable to take on this project at this time due to current capacity.\n\nWe wish you the best and hope to collaborate in the future.\n\nBest regards,\nTeam SYNDRIX`
  }

  // Send email
  if (RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'SYNDRIX <hello@syndrixoff.com>',
        to: project.client_email,
        subject: `Re: ${project.name}`,
        text: rejectText,
      }),
    })
  }

  // Log
  await supabase.from('project_updates').insert({ project_id: projectId, content: 'Inquiry declined — rejection email sent.', update_type: 'status_change' })

  // Notify staff
  await discordPost(DISCORD_STAFF_CHANNEL_ID!, {
    content: `❌ **${project.name}** rejected. Rejection email sent to ${project.client_email}.`,
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const signature = req.headers.get('X-Signature-Ed25519')
    const timestamp = req.headers.get('X-Signature-Timestamp')
    if (!signature || !timestamp || !DISCORD_PUBLIC_KEY) {
      return new Response('Bad request', { status: 401, headers: corsHeaders })
    }

    const rawBody = await req.text()
    const verified = await verifyDiscordRequest(rawBody, signature, timestamp, DISCORD_PUBLIC_KEY)
    if (!verified) return new Response('Invalid signature', { status: 401, headers: corsHeaders })

    const body = JSON.parse(rawBody)

    if (body.type === 1) {
      return new Response(JSON.stringify({ type: 1 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (body.type === 3) {
      const customId: string = body.data?.custom_id || ''
      const [action, projectId] = customId.split(':', 2)
      if (!action || !projectId) throw new Error('Invalid custom_id')

      if (action === 'approve') handleApprove(projectId)
      else if (action === 'reject') handleReject(projectId)
      else throw new Error('Unknown action')

      return new Response(JSON.stringify({ type: 6 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ type: 4, data: { content: 'Unhandled' } }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
