import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const DISCORD_PUBLIC_KEY = Deno.env.get('DISCORD_PUBLIC_KEY')
const GUMLOOP_DECISION_WEBHOOK = Deno.env.get('GUMLOOP_DECISION_WEBHOOK_URL')

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

async function verifyDiscordRequest(
  rawBody: string,
  signature: string,
  timestamp: string,
  publicKey: string,
): Promise<boolean> {
  try {
    const keyBytes = hexToUint8Array(publicKey)
    const sigBytes = hexToUint8Array(signature)
    const message = new TextEncoder().encode(timestamp + rawBody)

    const key = await crypto.subtle.importKey(
      'raw', keyBytes, { name: 'Ed25519' }, false, ['verify'],
    )

    return await crypto.subtle.verify({ name: 'Ed25519' }, key, sigBytes, message)
  } catch {
    return false
  }
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

    if (!verified) {
      return new Response('Invalid signature', { status: 401, headers: corsHeaders })
    }

    const body = JSON.parse(rawBody)

    if (body.type === 1) {
      return new Response(JSON.stringify({ type: 1 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (body.type === 3) {
      const customId: string = body.data?.custom_id || ''
      const [action, projectId] = customId.split(':', 2)

      if (!action || !projectId) {
        return new Response(
          JSON.stringify({ type: 4, data: { content: 'Invalid interaction' } }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }

      const decision = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : null
      if (!decision) {
        return new Response(
          JSON.stringify({ type: 4, data: { content: 'Unknown action' } }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }

      if (GUMLOOP_DECISION_WEBHOOK) {
        fetch(GUMLOOP_DECISION_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_id: projectId,
            decision,
            action,
          }),
        }).catch(() => {})
      }

      return new Response(JSON.stringify({ type: 6 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ type: 4, data: { content: 'Unhandled interaction' } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
