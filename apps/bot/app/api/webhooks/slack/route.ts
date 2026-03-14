/**
 * Slack Webhook Handler
 *
 * Receives Slack events and responds using the unified session system.
 * Uses Chat SDK for message handling and automatic markdown conversion.
 */

import { after } from 'next/server'
import { createSlackChat } from '@syner/slack'
import { classifyAndRoute } from '@/lib/router'
import { env } from '@/lib/env'
interface AgentCard {
  name: string
  description?: string
  instructions: string
  channel?: string
  metadata?: Record<string, unknown>
  [key: string]: unknown
}

export const maxDuration = 60

// Fetch agents from the static API endpoint (works in Vercel)
async function fetchAgentsByChannel(): Promise<Map<string, AgentCard>> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3001'

  try {
    const res = await fetch(`${baseUrl}/api/agents`, {
      headers: {
        'x-vercel-protection-bypass':
          process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error('[Slack] Failed to fetch agents:', res.status)
      return new Map()
    }

    const agents: AgentCard[] = await res.json()
    const map = new Map<string, AgentCard>()

    for (const agent of agents) {
      if (agent.channel) {
        map.set(agent.channel, agent)
      }
    }

    return map
  } catch (error) {
    console.error('[Slack] Error fetching agents:', error)
    return new Map()
  }
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

    chatInstance = createSlackChat(
      {
        botToken,
        signingSecret,
      },
      {
        async onMention(context) {
          console.log('[Slack] Mention received:', context.text?.slice(0, 100))

          // Find agent for this channel (fetches from static API endpoint)
          const agents = await fetchAgentsByChannel()
          const agent = agents.get(context.channel)

          if (!agent) {
            const configuredChannels = Array.from(agents.entries())
              .map(([id, a]) => `• \`${id}\` → ${a.name}`)
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

          // Route through classifier: direct, chain, or delegate
          const response = await classifyAndRoute(
            context.text,
            { channel: context.channel, agent },
            {
              onStatus: (status) => {
                console.log(`[Slack][${agent.name}] Status: ${status}`)
              },
            }
          )

          return response
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
