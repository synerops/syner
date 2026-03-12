#!/usr/bin/env node

import { createInterface } from 'readline/promises'
import { stdin, stdout, argv, exit } from 'process'
import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import {
  skillMd,
  agentRoute,
  nextConfig,
  packageJson,
  tsConfig,
  appPage,
  appLayout,
} from './templates.js'

interface AgentConfig {
  directory: string
  name: string
  description: string
}

async function prompt(rl: ReturnType<typeof createInterface>, question: string, defaultValue?: string): Promise<string> {
  const suffix = defaultValue ? ` (${defaultValue})` : ''
  const answer = await rl.question(`${question}${suffix}: `)
  return answer.trim() || defaultValue || ''
}

function parseArgs(): Partial<AgentConfig> {
  const args: Partial<AgentConfig> = {}
  const positional: string[] = []

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--name' && argv[i + 1]) {
      args.name = argv[++i]
    } else if (arg === '--description' && argv[i + 1]) {
      args.description = argv[++i]
    } else if (!arg.startsWith('--')) {
      positional.push(arg)
    }
  }

  if (positional[0]) args.directory = positional[0]
  return args
}

async function gather(): Promise<AgentConfig> {
  const args = parseArgs()

  console.log('\n  create-syner-agent\n')

  // If all args provided via flags, skip interactive prompts
  if (args.directory && args.name && args.description) {
    return args as AgentConfig
  }

  const rl = createInterface({ input: stdin, output: stdout })

  const directory = args.directory || await prompt(rl, 'Project directory', 'my-agent')
  const name = args.name || await prompt(rl, 'Agent name', directory)
  const description = args.description || await prompt(rl, 'Description', `A syner agent named ${name}`)

  rl.close()

  return { directory, name, description }
}

function scaffold(config: AgentConfig): void {
  const root = resolve(process.cwd(), config.directory)

  if (existsSync(root)) {
    console.error(`\nError: ${root} already exists.`)
    exit(1)
  }

  const dirs = [
    '',
    'app',
    'app/agent',
  ]

  for (const dir of dirs) {
    mkdirSync(join(root, dir), { recursive: true })
  }

  const files: Array<[string, string]> = [
    ['SKILL.md', skillMd(config.name, config.description)],
    ['app/agent/route.ts', agentRoute()],
    ['next.config.ts', nextConfig(config.name)],
    ['package.json', packageJson(config.name, config.description)],
    ['tsconfig.json', tsConfig()],
    ['app/page.tsx', appPage(config.name)],
    ['app/layout.tsx', appLayout(config.name)],
  ]

  for (const [path, content] of files) {
    writeFileSync(join(root, path), content)
  }

  console.log(`\nCreated ${config.name} in ${root}/`)
  console.log('\nFiles:')
  for (const [path] of files) {
    console.log(`  ${path}`)
  }
  console.log(`\nNext steps:`)
  console.log(`  cd ${config.directory}`)
  console.log(`  bun install`)
  console.log(`  bun run dev`)
  console.log(`  # Visit /agent to see your manifest`)
}

async function main(): Promise<void> {
  const config = await gather()
  scaffold(config)
}

main().catch((err) => {
  console.error(err)
  exit(1)
})
