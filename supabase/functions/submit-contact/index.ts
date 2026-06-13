import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY')
const DISCORD_BOT_TOKEN = Deno.env.get('DISCORD_BOT_TOKEN')
const DISCORD_STAFF_CHANNEL_ID = Deno.env.get('DISCORD_STAFF_CHANNEL_ID')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    if (!turnstileSecret) {
      return new Response(JSON.stringify({ error: 'Server misconfigured: missing Turnstile secret.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { name, email, company, budget, project, turnstileToken } = await req.json()

    if (!name || !email || !project || !turnstileToken) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken })
    })
    const verifyData = await verifyRes.json()
    if (!verifyData.success) {
      return new Response(JSON.stringify({ error: 'Captcha verification failed' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: contact, error: contactErr } = await supabase.from('contacts').insert({
      name, email,
      company: company || null,
      budget: budget || null,
      project
    }).select('id').single()
    if (contactErr) throw contactErr

    const { data: proj, error: projErr } = await supabase.from('projects').insert({
      name: project,
      description: project,
      client_name: name,
      client_email: email,
      budget: budget || null,
      contact_id: contact.id,
      status: 'pending_review'
    }).select('id, name').single()
    if (projErr) throw projErr

    await supabase.from('project_updates').insert({
      project_id: proj.id,
      content: 'New inquiry received — pending review',
      update_type: 'status_change'
    })

    if (DISCORD_BOT_TOKEN && DISCORD_STAFF_CHANNEL_ID) {
      fetch(`https://discord.com/api/v10/channels/${DISCORD_STAFF_CHANNEL_ID}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: '',
          embeds: [{
            title: '📩 New Client Inquiry',
            color: 15527139,
            fields: [
              { name: 'Client', value: name, inline: true },
              { name: 'Email', value: email, inline: true },
              { name: 'Company', value: company || '—', inline: true },
              { name: 'Budget', value: budget || '—', inline: true },
              { name: 'Project', value: project, inline: false }
            ],
            timestamp: new Date().toISOString()
          }],
          components: [{
            type: 1,
            components: [
              { type: 2, style: 3, label: '✅ Approve', custom_id: `approve:${proj.id}` },
              { type: 2, style: 4, label: '❌ Reject', custom_id: `reject:${proj.id}` }
            ]
          }]
        })
      }).catch(() => {})
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
