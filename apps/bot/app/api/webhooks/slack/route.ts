import { after, NextResponse } from 'next/server'
import { createHandler, createSlackClient } from '@syner/slack'
import { getAgentsByChannel, getModel } from '@/lib/agents'
import { ToolLoopAgent, stepCountIs } from 'ai'
import { env } from '@/lib/env'

export const maxDuration = 60

export async function POST(request: Request): Promise<Response> {
  console.log('[Slack Webhook] Request received')

  const botToken = env.SLACK_BOT_TOKEN
  const signingSecret = env.SLACK_SIGNING_SECRET

  // Check if Slack is configured
  if (!botToken || !signingSecret) {
    return NextResponse.json(
      { error: 'Slack integration not configured' },
      { status: 503 }
    )
  }

  const handler = createHandler({
    signingSecret,
    afterFn: after,

    onMessage: async (event, envelope) => {
      // Ignore bot messages to prevent loops
      if (event.bot_id || event.subtype === 'bot_message') return

      // Ignore empty messages
      if (!event.text?.trim()) return

      const agents = await getAgentsByChannel()
      const agent = agents.get(event.channel)

      // Ignore channels without an agent configured
      if (!agent) return

      const client = createSlackClient({ botToken })

      // Post initial message first so we can update it on error
      const initialMsg = await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.ts,
        text: '_Thinking..._',
      })
      const messageTs = initialMsg.ts!

      // Process in self-contained async block with its own error handling
      const processMessage = async () => {
        try {
          const slackAgent = new ToolLoopAgent({
            id: agent.name,
            model: getModel(agent),
            instructions: agent.instructions,
            stopWhen: stepCountIs(10),
          })

          console.log('[Slack Webhook] Calling agent.generate...')
          const result = await slackAgent.generate({
            prompt: event.text,
          })
          console.log('[Slack Webhook] agent.generate completed')

          await client.chat.update({
            channel: event.channel,
            ts: messageTs,
            text: result.text || '_No response_',
          })
          console.log('[Slack Webhook] Message updated')
        } catch (error) {
          console.log('[Slack Webhook] CATCH BLOCK HIT')
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error('[Slack Webhook] Error:', errorMessage)

          try {
            await client.chat.update({
              channel: event.channel,
              ts: messageTs,
              text: `_Error: ${errorMessage}_`,
            })
            console.log('[Slack Webhook] Error message posted')
          } catch (e) {
            console.error('[Slack Webhook] Failed to post error:', e)
          }
        }
      }

      // Execute with explicit catch to prevent unhandled rejections
      console.log('[Slack Webhook] Starting processMessage...')
      processMessage().catch(e => {
        console.error('[Slack Webhook] Unhandled rejection:', e)
      })
    },
  })

  return handler(request)
}
