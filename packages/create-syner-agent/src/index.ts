#!/usr/bin/env node

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
const templatesDir = resolve(__dirname, 'templates')

function parseArgs(args: string[]): Record<string, string> {
  const flags: Record<string, string> = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--') && i + 1 < args.length && !args[i + 1].startsWith('--')) {
      flags[arg.slice(2)] = args[i + 1]
      i++
    }
  }
  return flags
}

function ask(rl: ReturnType<typeof createInterface>, question: string, defaultValue?: string): Promise<string> {
  const suffix = defaultValue ? ` (${defaultValue})` : ''
  return new Promise((resolve) => {
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue || '')
    })
  })
}

function readTemplate(name: string): string {
  return readFileSync(join(templatesDir, name), 'utf-8')
}

function replaceVars(template: string, vars: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value)
  }
  return result
}

async function main() {
  const args = process.argv.slice(2)
  const flags = parseArgs(args)
  // First positional arg (not a flag or flag value) is the target directory
  const positional: string[] = []
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) { i++; continue }
    positional.push(args[i])
  }
  const targetDir = positional[0] || '.'
  const absoluteTarget = resolve(process.cwd(), targetDir)

  console.log('\n  create-syner-agent\n')
  console.log('  Scaffold a new syner agent with SKILL.md + agent route + withSyner()\n')

  let name: string, description: string, author: string

  if (flags.name) {
    // Non-interactive mode
    name = flags.name
    description = flags.description || 'A syner agent'
    author = flags.author || 'syner'
  } else {
    // Interactive mode
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    name = await ask(rl, '  Agent name', 'my-agent')
    description = await ask(rl, '  Description', 'A syner agent')
    author = await ask(rl, '  Author', 'syner')
    rl.close()
  }

  const vars = { name, description, author }

  // Create directories
  const appAgentDir = join(absoluteTarget, 'app', 'api', 'agent')
  mkdirSync(appAgentDir, { recursive: true })

  // Generate SKILL.md
  const skillContent = replaceVars(readTemplate('SKILL.md'), vars)
  const skillPath = join(absoluteTarget, 'SKILL.md')
  writeFileSync(skillPath, skillContent)
  console.log(`\n  created ${relative(absoluteTarget, skillPath)}`)

  // Generate app/api/agent/route.ts
  const routeContent = readTemplate('agent-route.ts')
  const routePath = join(appAgentDir, 'route.ts')
  writeFileSync(routePath, routeContent)
  console.log(`  created ${relative(absoluteTarget, routePath)}`)

  // Generate next.config.ts (only if not present)
  const nextConfigPath = join(absoluteTarget, 'next.config.ts')
  if (!existsSync(nextConfigPath) && !existsSync(join(absoluteTarget, 'next.config.js')) && !existsSync(join(absoluteTarget, 'next.config.mjs'))) {
    const nextConfigContent = readTemplate('next-config.ts')
    writeFileSync(nextConfigPath, nextConfigContent)
    console.log(`  created ${relative(absoluteTarget, nextConfigPath)}`)
  } else {
    console.log(`  skipped next.config (already exists) — add withSyner() manually`)
  }

  console.log('\n  Done! Next steps:\n')
  console.log('  1. Install dependencies:')
  console.log('     npm install @syner/vercel @syner/osprotocol')
  console.log('  2. Edit SKILL.md to describe your agent')
  console.log('  3. Start dev server: npm run dev')
  console.log('  4. Visit /agent to see your agent manifest\n')
}

function relative(from: string, to: string): string {
  return to.replace(from + '/', '')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
