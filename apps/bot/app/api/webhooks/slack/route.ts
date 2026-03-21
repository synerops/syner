import { after } from 'next/server'
import { createSlackChat } from '@syner/slack'
import { runtime } from '@/lib/runtime'
import { env } from '@/lib/env'

export const maxDuration = 60

let chatInstance: ReturnType<typeof createSlackChat> | null = null

function getChat() {
  if (!chatInstance) {
    const botToken = env.SLACK_BOT_TOKEN
    const signingSecret = env.SLACK_SIGNING_SECRET

    if (!botToken || !signingSecret) {
      throw new Error('Slack integration not configured')
    }

    chatInstance = createSlackChat(
      { botToken, signingSecret },
      {
        async onMention(context) {
          console.log('[Slack] Mention received:', context.text?.slice(0, 100))

          // Find agent for this channel via Map
          const agents = await runtime.byChannel()
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

          const instance = runtime.agent(agent.name)
          const result = await instance.spawn(context.text)
          return result.output?.text || '_No response_'
        },
      },
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
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
