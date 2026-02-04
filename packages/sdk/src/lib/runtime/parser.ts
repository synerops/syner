/**
 * SKILL.md Parser
 *
 * Parses SKILL.md files with YAML frontmatter and markdown content.
 */

import { readFile } from 'node:fs/promises'
import type { SkillDefinition, SkillMetadata, ProtocolDomain } from '../types'

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/

/**
 * Simple YAML parser for frontmatter (handles our specific format)
 */
function parseYamlFrontmatter(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const lines = yaml.split('\n')
  const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: result, indent: -1 }]

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
    const colonIndex = content.indexOf(':')

    if (colonIndex === -1) continue

    const key = content.slice(0, colonIndex).trim()
    const value = content.slice(colonIndex + 1).trim()

    if (value === '') {
      // Nested object
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
 * Validate skill metadata
 */
function validateMetadata(raw: Record<string, unknown>): SkillMetadata {
  if (typeof raw.name !== 'string') {
    throw new Error('SKILL.md must have a name field')
  }

  if (typeof raw.description !== 'string') {
    throw new Error('SKILL.md must have a description field')
  }

  if (!raw.protocol || typeof raw.protocol !== 'object') {
    throw new Error('SKILL.md must have a protocol section')
  }

  const protocol = raw.protocol as Record<string, unknown>

  if (typeof protocol.domain !== 'string') {
    throw new Error('SKILL.md protocol must have a domain field')
  }

  if (typeof protocol.api !== 'string') {
    throw new Error('SKILL.md protocol must have an api field')
  }

  const validDomains: ProtocolDomain[] = ['system', 'context', 'actions', 'checks', 'skills', 'workflows', 'runs']
  if (!validDomains.includes(protocol.domain as ProtocolDomain)) {
    throw new Error(`Invalid protocol domain: ${protocol.domain}`)
  }

  return {
    name: raw.name,
    description: raw.description,
    protocol: {
      domain: protocol.domain as ProtocolDomain,
      api: protocol.api,
    },
    extends: typeof raw.extends === 'string' ? raw.extends : undefined,
  }
}

/**
 * Parse a SKILL.md file
 */
export async function parseSkillFile(filePath: string): Promise<SkillDefinition> {
  const content = await readFile(filePath, 'utf-8')
  const match = content.match(FRONTMATTER_REGEX)

  if (!match || !match[1] || !match[2]) {
    throw new Error(`Invalid SKILL.md format: ${filePath}`)
  }

  const frontmatter = match[1]
  const markdown = match[2]
  const rawMetadata = parseYamlFrontmatter(frontmatter)
  const metadata = validateMetadata(rawMetadata)

  return {
    metadata,
    content: markdown.trim(),
    path: filePath,
  }
}

/**
 * Parse SKILL.md content directly (for testing or embedded definitions)
 */
export function parseSkillContent(content: string, path = '<inline>'): SkillDefinition {
  const match = content.match(FRONTMATTER_REGEX)

  if (!match || !match[1] || !match[2]) {
    throw new Error('Invalid SKILL.md format')
  }

  const frontmatter = match[1]
  const markdown = match[2]
  const rawMetadata = parseYamlFrontmatter(frontmatter)
  const metadata = validateMetadata(rawMetadata)

  return {
    metadata,
    content: markdown.trim(),
    path,
  }
}
