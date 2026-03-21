#!/usr/bin/env bun

/**
 * Build script: agents/*.md → public/.well-known/agents/index.json
 *
 * Reads agent markdown files, extracts frontmatter + body,
 * writes a static JSON registry that the runtime loads instead
 * of doing filesystem discovery at request time.
 *
 * Usage: bun run scripts/build-agents-registry.ts
 */

import { Glob } from 'bun'
import { readFile, writeFile, mkdir } from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..')
const AGENTS_DIR = path.join(PROJECT_ROOT, 'agents')
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'apps/bot/public/.well-known/agents')
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'index.json')

async function build() {
  const glob = new Glob('*.md')
  const files = Array.from(glob.scanSync(AGENTS_DIR)).map(f => path.join(AGENTS_DIR, f))

  const agents = []

  for (const file of files) {
    const basename = path.basename(file, '.md')

    // Skip private agents (underscore prefix)
    if (basename.startsWith('_')) continue

    const content = await readFile(file, 'utf-8')
    const { data, content: body } = matter(content)

    const meta = data.metadata as Record<string, unknown> | undefined

    agents.push({
      name: data.name || basename,
      description: data.description || '',
      instructions: body.trim(),
      model: data.model || undefined,
      tools: data.tools
        ? Array.isArray(data.tools)
          ? data.tools
          : String(data.tools).split(',').map((t: string) => t.trim())
        : undefined,
      skills: data.skills || undefined,
      channel: meta?.channel as string | undefined,
    })
  }

  agents.sort((a, b) => a.name.localeCompare(b.name))

  await mkdir(OUTPUT_DIR, { recursive: true })
  await writeFile(OUTPUT_PATH, JSON.stringify({ agents }, null, 2) + '\n')

  console.log(`[build-agents] ${agents.length} agents → ${path.relative(PROJECT_ROOT, OUTPUT_PATH)}`)
}

build().catch((err) => {
  console.error('[build-agents] ERROR:', err)
  process.exit(1)
})
