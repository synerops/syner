import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@syner/github'
import { env } from '@/lib/env'

export const maxDuration = 60

// TODO: Rewrite with runtime.generate() when GitHub agent is ready.
// Needs: agent with GitHub tools, channel routing by repo, access control.

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  const signature = request.headers.get('x-hub-signature-256')
  const eventType = request.headers.get('x-github-event')
  const deliveryId = request.headers.get('x-github-delivery')

  if (!signature || !eventType || !deliveryId) {
    return NextResponse.json({ error: 'Missing required headers' }, { status: 400 })
  }

  const isValid = verifyWebhookSignature({
    payload: rawBody,
    signature,
    secret: env.GITHUB_WEBHOOK_SECRET,
  })

  if (!isValid) {
    console.warn(`[GitHub] Invalid webhook signature delivery=${deliveryId}`)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  console.log(`[GitHub] Webhook received event=${eventType} delivery=${deliveryId}`)

  return NextResponse.json({ accepted: true, deliveryId, todo: 'runtime integration pending' })
}
