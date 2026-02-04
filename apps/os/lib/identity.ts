/**
 * Identity Loader
 *
 * Loads Syner's identity from packages/syner/ markdown files.
 * Parses AGENT.md frontmatter and builds the system prompt.
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/

/**
 * AGENT.md frontmatter metadata
 */
export interface AgentMetadata {
  name: string
  description: string
  version: string
  workflows: string[]
  annotations?: {
    whenToUse?: string[]
    examples?: string[]
  }
}

/**
 * Loaded identity for Syner
 */
export interface SynerIdentity {
  agent: {
    content: string
    metadata: AgentMetadata
  }
  personality: string
  rules: string
}

/**
 * Simple YAML parser for agent frontmatter
 */
function parseYamlFrontmatter(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const lines = yaml.split('\n')
  const stack: { obj: Record<string, unknown>; indent: number }[] = [
    { obj: result, indent: -1 },
  ]

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue

    const indent = line.search(/\S/)
    const content = line.trim()

    // Pop stack to find correct parent
    while (stack.length > 1 && (stack[stack.length - 1]?.indent ?? -1) >= indent) {
      stack.pop()
    }

    const current = stack[stack.length - 1]
    if (!current) continue
    const parent = current.obj

    // Handle list items
    if (content.startsWith('- ')) {
      const value = content.slice(2).trim()
      const lastKey = Object.keys(parent).pop()
      if (lastKey) {
        const existing = parent[lastKey]
        if (Array.isArray(existing)) {
          existing.push(value)
        } else if (existing === undefined || existing === '') {
          parent[lastKey] = [value]
        }
      }
      continue
    }

    const colonIndex = content.indexOf(':')
    if (colonIndex === -1) continue

    const key = content.slice(0, colonIndex).trim()
    const value = content.slice(colonIndex + 1).trim()

    if (value === '') {
      // Nested object or start of list
      const newObj: Record<string, unknown> = {}
      parent[key] = newObj
      stack.push({ obj: newObj, indent })
    } else {
      // Simple value
      parent[key] = value
    }
  }

  return result
}

/**
 * Validate and extract agent metadata
 */
function validateAgentMetadata(raw: Record<string, unknown>): AgentMetadata {
  const name = typeof raw.name === 'string' ? raw.name : 'syner'
  const description =
    typeof raw.description === 'string' ? raw.description : 'Default orchestrator agent'
  const version = typeof raw.version === 'string' ? raw.version : '0.0.1'
  const workflows = Array.isArray(raw.workflows) ? (raw.workflows as string[]) : []

  const annotations = raw.annotations as Record<string, unknown> | undefined
  const whenToUse = annotations?.whenToUse as string[] | undefined
  const examples = annotations?.examples as string[] | undefined

  return {
    name,
    description,
    version,
    workflows,
    annotations:
      whenToUse || examples
        ? {
            whenToUse,
            examples,
          }
        : undefined,
  }
}

/**
 * Parse an AGENT.md file
 */
async function parseAgentFile(
  filePath: string
): Promise<{ content: string; metadata: AgentMetadata }> {
  const content = await readFile(filePath, 'utf-8')
  const match = content.match(FRONTMATTER_REGEX)

  if (!match || !match[1] || !match[2]) {
    // No frontmatter, return content as-is with default metadata
    return {
      content: content.trim(),
      metadata: {
        name: 'syner',
        description: 'Default orchestrator agent',
        version: '0.0.1',
        workflows: [],
      },
    }
  }

  const frontmatter = match[1]
  const markdown = match[2]
  const rawMetadata = parseYamlFrontmatter(frontmatter)
  const metadata = validateAgentMetadata(rawMetadata)

  return {
    content: markdown.trim(),
    metadata,
  }
}

/**
 * Load Syner's identity from packages/syner/
 */
export async function loadSynerIdentity(basePath?: string): Promise<SynerIdentity> {
  // Resolve path to packages/syner relative to project root
  const synerPackagePath = basePath ?? join(process.cwd(), '..', '..', 'packages', 'syner')

  const [agent, personality, rules] = await Promise.all([
    parseAgentFile(join(synerPackagePath, 'AGENT.md')),
    readFile(join(synerPackagePath, 'PERSONALITY.md'), 'utf-8').catch(() => ''),
    readFile(join(synerPackagePath, 'RULES.md'), 'utf-8').catch(() => ''),
  ])

  return {
    agent,
    personality: personality.trim(),
    rules: rules.trim(),
  }
}

/**
 * Build the system prompt from identity and skill descriptions
 */
export function buildSystemPrompt(identity: SynerIdentity, skillDescriptions: string): string {
  const sections: string[] = []

  // Identity section
  sections.push(`<identity>
${identity.agent.content}
</identity>`)

  // Personality section
  if (identity.personality) {
    sections.push(`<personality>
${identity.personality}
</personality>`)
  }

  // Rules section
  if (identity.rules) {
    sections.push(`<rules>
${identity.rules}
</rules>`)
  }

  // Skills section
  if (skillDescriptions) {
    sections.push(`<available-skills>
${skillDescriptions}
</available-skills>`)
  }

  return sections.join('\n\n')
}
