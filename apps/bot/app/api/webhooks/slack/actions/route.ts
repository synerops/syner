/**
 * Slack Interactive Actions Handler
 *
 * Processes button clicks and modal submissions from Slack.
 * User-facing side of the supervisor gate — approval buttons
 * trigger this handler, which routes to /api/supervisor.
 */

import crypto from 'crypto'

interface SlackInteractionPayload {
  type: 'block_actions' | 'view_submission'
  user: { id: string; username: string }
  actions?: Array<{
    action_id: string
    value: string
    block_id: string
  }>
  response_url?: string
  channel?: { id: string }
  message?: { ts: string }
}

/**
 * POST /api/webhooks/slack/actions — Receive Slack interaction payloads
 */
export async function POST(request: Request) {
  // Slack sends interactions as application/x-www-form-urlencoded
  const formData = await request.formData()
  const payloadStr = formData.get('payload') as string

  if (!payloadStr) {
    return new Response('Missing payload', { status: 400 })
  }

  // Verify request signature
  const signingSecret = process.env.SLACK_SIGNING_SECRET
  if (signingSecret) {
    const timestamp = request.headers.get('x-slack-request-timestamp') || ''
    const signature = request.headers.get('x-slack-signature') || ''
    const body = `payload=${encodeURIComponent(payloadStr)}`

    const basestring = `v0:${timestamp}:${body}`
    const hmac = crypto.createHmac('sha256', signingSecret)
    hmac.update(basestring)
    const expected = `v0=${hmac.digest('hex')}`

    if (signature !== expected) {
      console.error('[Slack Actions] Invalid signature')
      return new Response('Invalid signature', { status: 401 })
    }
  }

  const payload: SlackInteractionPayload = JSON.parse(payloadStr)

  if (payload.type === 'block_actions' && payload.actions) {
    for (const action of payload.actions) {
      if (action.action_id.startsWith('supervisor_')) {
        await handleSupervisorAction(action, payload)
      }
    }
  }

  // Slack expects 200 OK within 3 seconds
  return new Response('', { status: 200 })
}

async function handleSupervisorAction(
  action: { action_id: string; value: string },
  payload: SlackInteractionPayload
) {
  // action_id format: supervisor_approve or supervisor_reject
  // value format: runId
  const decision = action.action_id === 'supervisor_approve' ? 'approved' : 'rejected'
  const runId = action.value

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3001'

  // Submit decision to supervisor gate
  const res = await fetch(`${baseUrl}/api/supervisor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '',
    },
    body: JSON.stringify({
      runId,
      decision,
      reason: `${decision} by @${payload.user.username}`,
    }),
  })

  if (!res.ok) {
    console.error(`[Slack Actions] Supervisor gate error: ${res.status}`)
    return
  }

  // Update the original Slack message
  if (payload.response_url) {
    const emoji = decision === 'approved' ? '✅' : '❌'
    const text = `${emoji} ${decision.charAt(0).toUpperCase() + decision.slice(1)} by @${payload.user.username}`

    await fetch(payload.response_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        replace_original: true,
        text,
      }),
    })
  }
}
