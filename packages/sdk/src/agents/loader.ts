/** @deprecated Use syner/registry — agent loader moved to packages/syner in v0.1.1 */
import { glob } from 'glob'
import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'
import { createRegistry } from '../registry'

export interface AgentCard {
  name: string
  description?: string
  instructions: string
  model?: 'opus' | 'sonnet' | 'haiku'
  tools?: string[]
  skills?: string[]
  metadata?: Record<string, unknown>
  protocol?: {
    version: string
    capabilities: string[]
  }
}

/**
 * Agents registry — discovers agent markdown files from `agents/*.md`.
 *
 * Usage:
 *   await agents.list()
 *   await agents.get('bot')
 *   await agents.filter(a => a.metadata?.channel === channelId)
 */
export const agents = createRegistry<AgentCard>({
  key: (agent) => agent.name,

  async discover(root) {
    const agentsDir = path.resolve(root, 'agents')
    const pattern = path.join(agentsDir, '*.md')
    const files = await glob(pattern)
    const result: AgentCard[] = []

    for (const file of files) {
      // OWASP A01: Path traversal prevention
      const resolved = path.resolve(file)
      if (!resolved.startsWith(agentsDir)) {
        console.warn(`Skipping file outside allowed directory: ${file}`)
        continue
      }

      try {
        const content = await readFile(resolved, 'utf-8')
        const { data, content: body } = matter(content)

        const name = data.name || path.basename(file, '.md')
        const meta = data.metadata as Record<string, unknown> | undefined

        result.push({
          name,
          description: data.description,
          instructions: body.trim(),
          model: data.model,
          tools: data.tools
            ? Array.isArray(data.tools)
              ? data.tools
              : String(data.tools).split(',').map((t: string) => t.trim())
            : undefined,
          skills: data.skills,
          metadata: meta,
          protocol: data.protocol,
        })
      } catch (error) {
        console.error(`Error parsing ${file}:`, error)
      }
    }

    return result.sort((a, b) => a.name.localeCompare(b.name))
  },
})
