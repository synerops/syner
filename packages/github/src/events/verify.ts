/**
 * GitHub Webhook Signature Verification
 *
 * Verifies HMAC-SHA256 signatures for GitHub webhook payloads.
 */

import { createHmac, timingSafeEqual } from 'crypto'

export interface VerifyWebhookOptions {
  /** Raw request body as string */
  payload: string
  /** X-Hub-Signature-256 header value */
  signature: string
  /** Webhook secret configured in GitHub App */
  secret: string
}

/**
 * Verifies that a webhook payload was signed by GitHub.
 *
 * Uses HMAC-SHA256 with timing-safe comparison to prevent timing attacks.
 *
 * @param options - Verification options
 * @returns true if signature is valid, false otherwise
 *
 * @example
 * ```ts
 * const isValid = verifyWebhookSignature({
 *   payload: rawBody,
 *   signature: req.headers['x-hub-signature-256'],
 *   secret: process.env.GITHUB_WEBHOOK_SECRET,
 * })
 *
 * if (!isValid) {
 *   return new Response('Unauthorized', { status: 401 })
 * }
 * ```
 */
export function verifyWebhookSignature(options: VerifyWebhookOptions): boolean {
  const { payload, signature, secret } = options

  if (!signature || !secret) {
    return false
  }

  // GitHub sends signature as "sha256=<hex>"
  const expectedSignature = signature.startsWith('sha256=')
    ? signature
    : `sha256=${signature}`

  const hmac = createHmac('sha256', secret)
  hmac.update(payload)
  const computedSignature = `sha256=${hmac.digest('hex')}`

  // Use timing-safe comparison to prevent timing attacks
  try {
    const sigBuffer = Buffer.from(expectedSignature)
    const computedBuffer = Buffer.from(computedSignature)

    if (sigBuffer.length !== computedBuffer.length) {
      return false
    }

    return timingSafeEqual(sigBuffer, computedBuffer)
  } catch {
    return false
  }
}

/**
 * Extracts webhook headers from a request.
 *
 * @param headers - Request headers (Headers object or plain object)
 * @returns Extracted GitHub webhook headers
 */
export function extractWebhookHeaders(
  headers: Headers | Record<string, string | undefined>
): {
  signature: string | undefined
  event: string | undefined
  deliveryId: string | undefined
} {
  const get = (name: string): string | undefined => {
    if (headers instanceof Headers) {
      return headers.get(name) ?? undefined
    }
    return headers[name] ?? headers[name.toLowerCase()]
  }

  return {
    signature: get('X-Hub-Signature-256'),
    event: get('X-GitHub-Event'),
    deliveryId: get('X-GitHub-Delivery'),
  }
}
