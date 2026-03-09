/**
 * Slack Webhook Handler
 *
 * Receives Slack events and responds using the unified session system.
 * Maps Slack channels to agents via agent config frontmatter.
 */

import { after, NextResponse } from 'next/server'
import { createHandler, createSlackClient } from '@syner/slack'
import { getAgentsByChannel } from '@/lib/agents'
import { createSession, type Session } from '@/lib/session'
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
      const agentConfig = agents.get(event.channel)

      // Ignore channels without an agent configured
      if (!agentConfig) return

      const client = createSlackClient({ botToken })

      // Post initial message first so we can update it on error
      const initialMsg = await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.ts,
        text: '_Setting up environment..._',
      })
      const messageTs = initialMsg.ts!

      // Helper to update Slack message
      const updateMessage = async (text: string) => {
        await client.chat.update({
          channel: event.channel,
          ts: messageTs,
          text,
        })
      }

      // Process in self-contained async block with its own error handling
      const processMessage = async () => {
        let session: Session | undefined

        try {
          console.log(`[Agent:${agentConfig.name}] Creating session`)

          session = await createSession({
            agent: agentConfig.name,
            onStatus: updateMessage,
            onToolStart: (toolName) => {
              console.log(`[Agent:${agentConfig.name}] Tool START: ${toolName}`)
            },
            onToolFinish: (toolName, durationMs, success) => {
              console.log(`[Agent:${agentConfig.name}] Tool FINISH: ${toolName} (${durationMs}ms, ${success ? 'ok' : 'error'})`)
            },
            onStepFinish: (stepNumber, toolNames) => {
              console.log(`[Agent:${agentConfig.name}] Step ${stepNumber} finished:`, toolNames)
            },
          })

          console.log(`[Agent:${agentConfig.name}] Session ready, workdir: ${session.workdir}`)
          console.log(`[Agent:${agentConfig.name}] Starting generation for prompt: "${event.text?.slice(0, 100)}..."`)

          const result = await session.generate(event.text!)

          await updateMessage(result.text || '_No response_')
          console.log(`[Agent:${agentConfig.name}] Message updated in Slack`)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error(`[Agent:${agentConfig.name}] Error:`, errorMessage)
          if (error instanceof Error && error.stack) {
            console.error(`[Agent:${agentConfig.name}] Stack:`, error.stack)
          }

          try {
            await updateMessage(`_Error: ${errorMessage}_`)
          } catch (e) {
            console.error(`[Agent:${agentConfig.name}] Failed to post error to Slack:`, e)
          }
        } finally {
          // Always cleanup the session
          if (session) {
            console.log(`[Agent:${agentConfig.name}] Cleaning up session...`)
            await session.cleanup()
            console.log(`[Agent:${agentConfig.name}] Session cleaned up`)
          }
        }
      }

      // Execute with explicit catch to prevent unhandled rejections
      processMessage().catch(e => {
        console.error(`[Agent:${agentConfig.name}] Unhandled rejection:`, e)
      })
    },
  })

  return handler(request)
}
