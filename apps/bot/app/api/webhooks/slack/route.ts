import { after, NextResponse } from 'next/server'
import { createHandler, createSlackClient } from '@syner/slack'
import { getAgentsByChannel, getModel } from '@/lib/agents'
import { createToolSession, type ToolSession } from '@/lib/tools'
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
        text: '_Setting up environment..._',
      })
      const messageTs = initialMsg.ts!

      // Process in self-contained async block with its own error handling
      const processMessage = async () => {
        let session: ToolSession | undefined

        try {
          // Create tool session with shared sandbox (if agent has tools)
          let workdir = '.'

          if (agent.tools && agent.tools.length > 0) {
            console.log(`[Agent:${agent.name}] Creating sandbox with tools: ${agent.tools.join(', ')}`)

            await client.chat.update({
              channel: event.channel,
              ts: messageTs,
              text: '_Cloning repository..._',
            })

            session = await createToolSession(agent.tools)
            workdir = session.workdir

            console.log(`[Agent:${agent.name}] Sandbox ready, workdir: ${workdir}`)
          }

          await client.chat.update({
            channel: event.channel,
            ts: messageTs,
            text: '_Thinking..._',
          })

          const slackAgent = new ToolLoopAgent({
            id: agent.name,
            model: getModel(agent),
            instructions: `${agent.instructions}\n\n## Working Directory\n\nThe repository is available at: ${workdir}`,
            tools: session?.tools,
            stopWhen: stepCountIs(10),
          })

          console.log(`[Agent:${agent.name}] Starting generation for prompt: "${event.text?.slice(0, 100)}..."`)

          const result = await slackAgent.generate({
            prompt: event.text,

            // Tool call started
            experimental_onToolCallStart({ toolCall }) {
              console.log(`[Agent:${agent.name}] Tool START: ${toolCall.toolName}`)
              console.log(`[Agent:${agent.name}]   Input:`, JSON.stringify(toolCall.input, null, 2))
            },

            // Tool call finished
            experimental_onToolCallFinish({ toolCall, durationMs, success, output, error }) {
              console.log(`[Agent:${agent.name}] Tool FINISH: ${toolCall.toolName} (${durationMs}ms)`)
              if (success) {
                const outputStr = typeof output === 'string' ? output : JSON.stringify(output)
                console.log(`[Agent:${agent.name}]   Output (${outputStr.length} chars):`, outputStr.slice(0, 500))
              } else {
                console.error(`[Agent:${agent.name}]   Error:`, error)
              }
            },

            // Step finished
            onStepFinish({ stepNumber, finishReason, toolCalls, usage }) {
              console.log(`[Agent:${agent.name}] Step ${stepNumber} finished:`, {
                finishReason,
                tools: toolCalls?.map(tc => tc.toolName) || [],
                tokens: usage ? `${usage.inputTokens}in/${usage.outputTokens}out` : 'n/a',
              })
            },

            // Agent finished
            onFinish({ totalUsage, steps }) {
              console.log(`[Agent:${agent.name}] Generation complete:`, {
                totalSteps: steps.length,
                totalTokens: totalUsage?.totalTokens || 'n/a',
              })
            },
          })

          await client.chat.update({
            channel: event.channel,
            ts: messageTs,
            text: result.text || '_No response_',
          })
          console.log(`[Agent:${agent.name}] Message updated in Slack`)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error(`[Agent:${agent.name}] Error:`, errorMessage)
          if (error instanceof Error && error.stack) {
            console.error(`[Agent:${agent.name}] Stack:`, error.stack)
          }

          try {
            await client.chat.update({
              channel: event.channel,
              ts: messageTs,
              text: `_Error: ${errorMessage}_`,
            })
          } catch (e) {
            console.error(`[Agent:${agent.name}] Failed to post error to Slack:`, e)
          }
        } finally {
          // Always cleanup the sandbox
          if (session) {
            console.log(`[Agent:${agent.name}] Cleaning up sandbox...`)
            await session.cleanup()
            console.log(`[Agent:${agent.name}] Sandbox cleaned up`)
          }
        }
      }

      // Execute with explicit catch to prevent unhandled rejections
      processMessage().catch(e => {
        console.error(`[Agent:${agent.name}] Unhandled rejection:`, e)
      })
    },
  })

  return handler(request)
}
