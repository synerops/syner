import { glob } from 'glob'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import matter from 'gray-matter'
import path from 'path'

export interface AgentCard {
  name: string
  description?: string
  instructions: string
  model?: 'opus' | 'sonnet' | 'haiku'
  tools?: string[]
  skills?: string[]
  channel?: string
  metadata?: Record<string, unknown>
  protocol?: {
    version: string
    capabilities: string[]
  }
}

interface AgentsRegistry {
  agents: Map<string, AgentCard>
  list: AgentCard[]
}

// ---------------------------------------------------------------------------
// AgentsMap — domain-aware collection (parallel to SkillsMap)
// ---------------------------------------------------------------------------

export class AgentsMap extends Map<string, AgentCard> {
  /** Get agents indexed by their Slack channel ID */
  byChannel(): Map<string, AgentCard> {
    const map = new Map<string, AgentCard>()
    for (const agent of this.values()) {
      if (agent.channel) map.set(agent.channel, agent)
    }
    return map
  }
}

// Singleton cache
let cachedRegistry: AgentsRegistry | null = null
let cachedProjectRoot: string | null = null

async function buildRegistry(projectRoot: string): Promise<AgentsRegistry> {
  const agents = new Map<string, AgentCard>()
  const list: AgentCard[] = []

  const agentsDir = path.resolve(projectRoot, 'agents')
  const pattern = path.join(agentsDir, '*.md')
  const files = await glob(pattern)

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
      const agent: AgentCard = {
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
        channel: meta?.channel as string | undefined,
        metadata: meta,
        protocol: data.protocol,
      }

      agents.set(name, agent)
      list.push(agent)
    } catch (error) {
      console.error(`Error parsing ${file}:`, error)
    }
  }

  // Sort by name
  list.sort((a, b) => a.name.localeCompare(b.name))

  return { agents, list }
}

export function invalidateAgentsCache(): void {
  cachedRegistry = null
  cachedProjectRoot = null
}

export async function getAgentsRegistry(projectRoot: string): Promise<AgentsRegistry> {
  // Invalidate cache if project root changed
  if (cachedRegistry && cachedProjectRoot === projectRoot) {
    return cachedRegistry
  }
  cachedRegistry = await buildRegistry(projectRoot)
  cachedProjectRoot = projectRoot
  return cachedRegistry
}

export async function getAgentsList(projectRoot: string): Promise<AgentCard[]> {
  const registry = await getAgentsRegistry(projectRoot)
  return registry.list
}

export async function getAgentByName(projectRoot: string, name: string): Promise<AgentCard | undefined> {
  const registry = await getAgentsRegistry(projectRoot)
  return registry.agents.get(name)
}

/**
 * Get agents indexed by their Slack channel ID
 * Only returns agents that have a channel configured
 */
export async function getAgentsByChannel(projectRoot: string): Promise<Map<string, AgentCard>> {
  const registry = await getAgentsRegistry(projectRoot)
  const map = new Map<string, AgentCard>()

  for (const agent of registry.list) {
    if (agent.channel) {
      map.set(agent.channel, agent)
    }
  }

  return map
}

/**
 * Load agents from a pre-built JSON index (parallel to loadSkills pattern).
 *
 * Falls back to filesystem discovery if the index doesn't exist (dev without build step).
 */
export async function loadAgents(indexPath: string, projectRoot?: string): Promise<AgentsMap> {
  if (!existsSync(indexPath)) {
    if (projectRoot) {
      const registry = await getAgentsRegistry(projectRoot)
      return new AgentsMap(registry.agents)
    }
    return new AgentsMap()
  }

  const raw = await readFile(indexPath, 'utf-8')
  const { agents } = JSON.parse(raw) as { agents: AgentCard[] }
  const map = new AgentsMap()
  for (const agent of agents) {
    map.set(agent.name, agent)
  }
  return map
}
