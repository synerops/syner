/**
 * Slack Slash Commands Handler
 *
 * Handles /syner slash commands to invoke skills directly.
 *
 * Commands:
 *   /syner help              - List available skills
 *   /syner <skill> [args]    - Invoke a specific skill
 */

import { after } from 'next/server'
import { createCommandHandler, type SlackSlashCommand, type SlackCommandResponse } from '@syner/slack'
import { discoverCommandSkills, type CommandConfig } from '@syner/vercel'
import { createSession } from '@/lib/session'
import { env } from '@/lib/env'
import path from 'path'

export const maxDuration = 60

// Cache discovered commands
let commandCache: Map<string, CommandConfig> | null = null
let cacheTime = 0
const CACHE_TTL_MS = 60000 // 1 minute

async function getCommands(): Promise<Map<string, CommandConfig>> {
  const now = Date.now()

  // Return cached commands if still valid
  if (commandCache && now - cacheTime < CACHE_TTL_MS) {
    return commandCache
  }

  // Discover commands from skills
  const repoRoot = path.resolve(process.cwd(), '../..')
  const commands = await discoverCommandSkills(repoRoot)

  // Build map by command name
  commandCache = new Map()
  for (const cmd of commands) {
    commandCache.set(cmd.name, cmd)
  }

  cacheTime = now
  console.log(`[SlashCommand] Discovered ${commandCache.size} commands`)

  return commandCache
}

async function handleCommand(command: SlackSlashCommand): Promise<SlackCommandResponse | void> {
  const [commandName, ...args] = command.text.trim().split(/\s+/)
  const commandArgs = args.join(' ')

  console.log(`[SlashCommand] ${command.command} ${command.text} from @${command.user_name}`)

  // Get available commands
  const commands = await getCommands()

  // Handle /syner help
  if (!commandName || commandName === 'help') {
    return {
      text: formatHelp(commands),
      response_type: 'ephemeral',
    }
  }

  // Look up the command
  const cmdConfig = commands.get(commandName)
  if (!cmdConfig) {
    return {
      text: `Unknown command: \`${commandName}\`\n\nUse \`/syner help\` to see available commands.`,
      response_type: 'ephemeral',
    }
  }

  // Create a session for the agent
  const session = await createSession({
    agentName: cmdConfig.agent,
    onStatus: (status) => {
      console.log(`[SlashCommand][${cmdConfig.agent}] Status: ${status}`)
    },
  })

  try {
    // Build the prompt to invoke the skill
    const prompt = `/${cmdConfig.skillName} ${commandArgs}`.trim()
    console.log(`[SlashCommand][${cmdConfig.agent}] Invoking: ${prompt}`)

    const result = await session.generate(prompt)

    return {
      text: result.text || '_No response_',
      response_type: 'in_channel',
    }
  } finally {
    await session.cleanup()
  }
}

function formatHelp(commands: Map<string, CommandConfig>): string {
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
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const handler = createCommandHandler({
    signingSecret,
    afterFn: after,
    onCommand: handleCommand,
  })

  return handler(request)
}
