import { createHmac, timingSafeEqual } from 'crypto'
import type {
  SlackEventEnvelope,
  SlackUrlVerification,
  SlackHandlerConfig,
  SlackMessageEvent,
  SlackAppMentionEvent,
} from './types'
import { isUrlVerification, isMessageEvent, isAppMentionEvent } from './types'

/**
 * Verify Slack request signature
 * Uses timing-safe comparison to prevent timing attacks (OWASP A02)
 */
function verifySignature(
  signingSecret: string,
  signature: string,
  timestamp: string,
  body: string
): boolean {
  // Check timestamp is within 5 minutes to prevent replay attacks
  const requestTimestamp = parseInt(timestamp, 10)
  const currentTime = Math.floor(Date.now() / 1000)
  if (Math.abs(currentTime - requestTimestamp) > 300) {
    return false
  }

  const sigBaseString = `v0:${timestamp}:${body}`
  const mySignature = `v0=${createHmac('sha256', signingSecret)
    .update(sigBaseString)
    .digest('hex')}`

  // Timing-safe comparison
  try {
    return timingSafeEqual(
      Buffer.from(mySignature, 'utf8'),
      Buffer.from(signature, 'utf8')
    )
  } catch {
    return false
  }
}

/**
 * Create a Next.js route handler for Slack events
 */
export function createHandler(config: SlackHandlerConfig) {
  return async function handler(request: Request): Promise<Response> {
    // Get raw body for signature verification
    const body = await request.text()

    // Verify signature
    const signature = request.headers.get('x-slack-signature')
    const timestamp = request.headers.get('x-slack-request-timestamp')

    if (!signature || !timestamp) {
      return new Response('Missing signature headers', { status: 401 })
    }

    if (!verifySignature(config.signingSecret, signature, timestamp, body)) {
      return new Response('Invalid signature', { status: 401 })
    }

    // Parse payload
    let payload: SlackEventEnvelope | SlackUrlVerification
    try {
      payload = JSON.parse(body)
    } catch {
      return new Response('Invalid JSON', { status: 400 })
    }

    // Handle URL verification challenge
    if (isUrlVerification(payload)) {
      return new Response(payload.challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    // For event callbacks, respond immediately and process in background
    // This is required because Slack expects a response within 3 seconds
    const envelope = payload as SlackEventEnvelope

    // Use Next.js after() if available, otherwise process inline
    const processEvent = async () => {
      const event = envelope.event

      // Skip bot messages to prevent loops
      if (isMessageEvent(event) && event.bot_id) {
        return
      }

      // Route to appropriate handler
      if (isMessageEvent(event) && config.onMessage) {
        await config.onMessage(event as SlackMessageEvent, envelope)
      } else if (isAppMentionEvent(event) && config.onAppMention) {
        await config.onAppMention(event as SlackAppMentionEvent, envelope)
      }
    }

    if (config.afterFn) {
      // Process in background using Next.js after()
      config.afterFn(processEvent)
    } else {
      // Process inline (for testing or non-Next.js environments)
      await processEvent()
    }

    // Acknowledge receipt immediately
    return new Response('', { status: 200 })
  }
}
