import matter from 'gray-matter'
import type { Skill, InputField, OutputField } from './types/skill'

export interface ParseResult {
  skill: Skill
  warnings: string[]
}

function parseListSection(body: string, heading: string): string[] | undefined {
  const regex = new RegExp(`^##\\s+${heading}\\s*$`, 'im')
  const match = body.search(regex)
  if (match === -1) return undefined

  const afterHeading = body.slice(match)
  const lines = afterHeading.split('\n').slice(1)
  const items: string[] = []

  for (const line of lines) {
    if (/^##\s/.test(line)) break
    const listMatch = line.match(/^[-*]\s+(.+)/)
    if (listMatch) items.push(listMatch[1].trim())
  }

  return items.length > 0 ? items : undefined
}

function parseInputs(body: string): InputField[] | undefined {
  const items = parseListSection(body, 'Inputs')
  if (!items) return undefined

  return items.map((item) => {
    const match = item.match(/^(\w+)\s*\(([^)]+)\)(?:\s*[-—]\s*(.+))?/)
    if (match) {
      const required = match[2].includes('required')
      const type = match[2].replace(/,?\s*required/, '').trim() || 'string'
      return {
        name: match[1],
        type,
        required: required || undefined,
        description: match[3]?.trim(),
      }
    }
    // Simple format: just a name
    return { name: item, type: 'string' }
  })
}

function parseOutputs(body: string): OutputField[] | undefined {
  const items = parseListSection(body, 'Outputs')
  if (!items) return undefined

  return items.map((item) => {
    const match = item.match(/^(\w+)\s*\(([^)]+)\)(?:\s*[-—]\s*(.+))?/)
    if (match) {
      return {
        name: match[1],
        type: match[2].trim(),
        description: match[3]?.trim(),
      }
    }
    return { name: item, type: 'string' }
  })
}

// Extension fields that support 3-tier priority
const EXTENSION_FIELDS = ['preconditions', 'effects', 'verification', 'visibility', 'notFor'] as const

const BODY_HEADING_MAP: Record<string, string> = {
  preconditions: 'Preconditions',
  effects: 'Effects',
  verification: 'Verification',
  notFor: 'I am NOT',
}

export function parseSkillManifest(content: string): ParseResult {
  const { data, content: body } = matter(content)
  const warnings: string[] = []

  const manifest: Skill = {}

  // Standard Agent Skills fields — always from top-level frontmatter
  if (data.name) manifest.name = data.name
  if (data.description) manifest.description = data.description
  if (data.category) manifest.category = data.category

  // Copy metadata (excluding extension fields handled below)
  if (data.metadata) {
    manifest.metadata = {
      version: data.metadata.version,
      author: data.metadata.author,
    }
  }

  // Extension fields: 3-tier priority
  for (const field of EXTENSION_FIELDS) {
    // Tier 1: frontmatter.metadata.*
    if (data.metadata?.[field] !== undefined) {
      ;(manifest as Record<string, unknown>)[field] = data.metadata[field]
      continue
    }

    // Tier 2: top-level frontmatter
    if (data[field] !== undefined) {
      ;(manifest as Record<string, unknown>)[field] = data[field]
      warnings.push(`${field} found at top-level frontmatter, move to metadata for Agent Skills spec compliance`)
      continue
    }

    // Tier 3: markdown body sections
    const heading = BODY_HEADING_MAP[field]
    if (heading) {
      const items = parseListSection(body, heading)
      if (items) {
        ;(manifest as Record<string, unknown>)[field] = items
      }
    }
  }

  // Inputs: 3-tier priority
  if (data.metadata?.inputs !== undefined) {
    manifest.inputs = data.metadata.inputs
  } else if (data.inputs !== undefined) {
    manifest.inputs = data.inputs
    warnings.push('inputs found at top-level frontmatter, move to metadata for Agent Skills spec compliance')
  } else {
    const inputs = parseInputs(body)
    if (inputs) manifest.inputs = inputs
  }

  // Outputs: 3-tier priority
  if (data.metadata?.outputs !== undefined) {
    manifest.outputs = data.metadata.outputs
  } else if (data.outputs !== undefined) {
    manifest.outputs = data.outputs
    warnings.push('outputs found at top-level frontmatter, move to metadata for Agent Skills spec compliance')
  } else {
    const outputs = parseOutputs(body)
    if (outputs) manifest.outputs = outputs
  }

  return { skill: manifest, warnings }
}
