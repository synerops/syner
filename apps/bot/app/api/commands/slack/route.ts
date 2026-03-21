import { after } from 'next/server'
import { createCommandHandler, type SlackSlashCommand, type SlackCommandResponse } from '@syner/slack'
import type { CommandInfo } from '@syner/vercel'
import { runtime } from '@/lib/runtime'
import { env } from '@/lib/env'

export const maxDuration = 60

async function handleCommand(command: SlackSlashCommand): Promise<SlackCommandResponse | void> {
  const [commandName, ...args] = command.text.trim().split(/\s+/)
  const commandArgs = args.join(' ')

  console.log(`[SlashCommand] ${command.command} ${command.text} from @${command.user_name}`)

  // Single start() loads both agents and skills
  if (runtime.agents.size === 0) await runtime.start()
  const commands = runtime.skills.commands()

  if (!commandName || commandName === 'help') {
    return { text: formatHelp(commands), response_type: 'ephemeral' }
  }

  const cmdConfig = commands.get(commandName)
  if (!cmdConfig) {
    return {
      text: `Unknown command: \`${commandName}\`\n\nUse \`/syner help\` to see available commands.`,
      response_type: 'ephemeral',
    }
  }

  const prompt = `/${cmdConfig.skillName} ${commandArgs}`.trim()
  console.log(`[SlashCommand][${cmdConfig.agent}] Invoking: ${prompt}`)

  try {
    const agent = runtime.agent(cmdConfig.agent)
    const result = await agent.spawn(prompt, {
      onStatus: (status) => console.log(`[SlashCommand][${cmdConfig.agent}] Status: ${status}`),
    })

    return {
      text: result.output?.text || '_No response_',
      response_type: 'in_channel',
    }
  } catch {
    return {
      text: `Agent "${cmdConfig.agent}" not found for command "${commandName}".`,
      response_type: 'ephemeral',
    }
  }
}

function formatHelp(commands: Map<string, CommandInfo>): string {
  const lines = [
    '*Syner Commands*',
    '',
    'Usage: `/syner <command> [arguments]`',
    '',
    '*Available commands:*',
    '• `help` - Show available commands',
  ]

  for (const [name, config] of commands) {
    lines.push(`• \`${name}\` - ${config.description}`)
  }

  if (commands.size === 0) {
    lines.push('')
    lines.push('_No skills are currently exposed as commands._')
    lines.push('_Add `command: <name>` to a skill\'s frontmatter to expose it._')
  }

  return lines.join('\n')
}

export async function POST(request: Request): Promise<Response> {
  console.log('[SlashCommand] Request received')

  const signingSecret = env.SLACK_SIGNING_SECRET
  if (!signingSecret) {
    return new Response(
      JSON.stringify({ error: 'Slack integration not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const handler = createCommandHandler({
    signingSecret,
    afterFn: after,
    onCommand: handleCommand,
  })

  return handler(request)
}
