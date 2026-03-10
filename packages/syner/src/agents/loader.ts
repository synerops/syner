import { glob } from 'glob'
import { readFileSync } from 'fs'
import matter from 'gray-matter'
import path from 'path'

export interface AgentConfig {
  name: string
  description?: string
  instructions: string
  model?: 'opus' | 'sonnet' | 'haiku'
  tools?: string[]
  skills?: string[]
  channel?: string
  filePath: string
}

/**
 * Load all agent configurations from markdown files
 */
export async function loadAgents(projectRoot: string): Promise<AgentConfig[]> {
  const agentsDir = path.resolve(projectRoot, 'agents')
  const pattern = path.join(agentsDir, '*.md')
  const files = await glob(pattern)

  return files.map(file => {
    // OWASP A01: Path traversal prevention
    const resolved = path.resolve(file)
    if (!resolved.startsWith(agentsDir)) {
      throw new Error(`Invalid agent path: ${file}`)
    }

    const content = readFileSync(resolved, 'utf-8')
    const { data, content: body } = matter(content)

    return {
      name: data.name || path.basename(file, '.md'),
      description: data.description,
      instructions: body.trim(),
      model: data.model,
      tools: data.tools ? String(data.tools).split(',').map(t => t.trim()) : undefined,
      skills: data.skills,
      channel: data.channel,
      filePath: resolved,
    }
  })
}

/**
 * Get agents indexed by their Slack channel ID
 * Only returns agents that have a channel configured
 */
export async function getAgentsByChannel(projectRoot: string): Promise<Map<string, AgentConfig>> {
  const agents = await loadAgents(projectRoot)
  const map = new Map<string, AgentConfig>()

  for (const agent of agents) {
    if (agent.channel) {
      map.set(agent.channel, agent)
    }
  }

  return map
}

/**
 * Get a specific agent by name
 */
export async function getAgentByName(projectRoot: string, name: string): Promise<AgentConfig | undefined> {
  const agents = await loadAgents(projectRoot)
  return agents.find(a => a.name === name)
}
