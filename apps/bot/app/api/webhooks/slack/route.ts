import { after } from 'next/server'
import { createSlackChat } from '@syner/slack'
import { runtime, ensureStarted } from 'syner/run'
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

          await ensureStarted()

          // Find agent for this channel from runtime's pre-loaded data
          const agent = [...runtime.agents.values()].find(
            a => a.metadata?.channel === context.channel
          )

          if (!agent) {
            const configuredChannels = [...runtime.agents.values()]
              .filter(a => a.metadata?.channel)
              .map(a => `• \`${a.metadata?.channel}\` → ${a.name}`)
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

          // Build enriched prompt with thread context
          const instance = runtime.agent(agent.name)
          let prompt = context.text

          if (context.recentMessages.length > 1) {
            const history = context.recentMessages
              .slice(0, -1) // exclude the current message (already in context.text)
              .map(m => `[${m.author.userId}]: ${m.text}`)
              .join('\n')

            prompt = `<thread-context>\n<channel>${context.channel}</channel>\n<user>${context.userId}</user>\n<history>\n${history}\n</history>\n</thread-context>\n\n${context.text}`
          }

          const { fullStream } = await instance.stream(prompt)
          return fullStream
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
    return Response.json({ error: 'Slack webhook error' }, { status: 500 })
  }
}
