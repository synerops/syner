/**
 * Slack Webhook Handler
 *
 * Receives Slack events and responds using the unified session system.
 * Uses Chat SDK for message handling and automatic markdown conversion.
 */

import { after } from 'next/server'
import { createSlackChat } from '@syner/slack'
import { getAgentsByChannel } from 'syner/agents'
import { createSession } from '@/lib/session'
import { env } from '@/lib/env'
import path from 'path'

export const maxDuration = 60

function getProjectRoot(): string {
  return path.resolve(process.cwd(), '../..')
}

// Lazy-init chat instance
let chatInstance: ReturnType<typeof createSlackChat> | null = null

function getChat() {
  if (!chatInstance) {
    const botToken = env.SLACK_BOT_TOKEN
    const signingSecret = env.SLACK_SIGNING_SECRET

    if (!botToken || !signingSecret) {
      throw new Error('Slack integration not configured')
    }

    const projectRoot = getProjectRoot()

    chatInstance = createSlackChat(
      {
        botToken,
        signingSecret,
      },
      {
        async onMention(context) {
          console.log('[Slack] Mention received:', context.text?.slice(0, 100))

          // Find agent for this channel
          const agents = await getAgentsByChannel(projectRoot)
          const agentConfig = agents.get(context.channel)

          if (!agentConfig) {
            const configuredChannels = Array.from(agents.entries())
              .map(([id, agent]) => `• \`${id}\` → ${agent.name}`)
              .join('\n')

            return [
              `*No agent configured for this channel*`,
              ``,
              `Channel ID: \`${context.channel}\``,
              ``,
              `To fix, add to an agent's frontmatter in \`agents/*.md\`:`,
              `\`\`\``,
              `channel: ${context.channel}`,
              `\`\`\``,
              ``,
              configuredChannels
                ? `*Currently configured:*\n${configuredChannels}`
                : `_No channels configured yet._`,
            ].join('\n')
          }

          // Create session and generate response
          const session = await createSession({
            agent: agentConfig.name,
            onStatus: (status) => {
              console.log(`[Slack][${agentConfig.name}] Status: ${status}`)
            },
          })

          try {
            const result = await session.generate(context.text)
            console.log(`[Slack][${agentConfig.name}] Generated ${result.text.length} chars`)
            return result.text || '_No response_'
          } finally {
            await session.cleanup()
          }
        },
      }
    )
  }

  return chatInstance
}

export async function POST(request: Request): Promise<Response> {
  console.log('[Slack] Request received')

  try {
    const { webhooks } = getChat()
    return webhooks.slack(request, {
      waitUntil: (p: Promise<unknown>) => after(() => p),
    })
  } catch (error) {
    console.error('[Slack] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Slack webhook error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
