export type SkillVisibility = 'public' | 'instance' | 'private'

/**
 * Unified skill entry — the single shape for skills across the entire codebase.
 *
 * Replaces: Skill (osprotocol metadata), SkillIndexEntry (build), SkillDescriptor (vercel).
 */
export interface SkillEntry {
  // Identity
  name: string
  slug: string
  description: string
  category: string
  visibility: SkillVisibility

  // Content (markdown body of SKILL.md)
  content: string

  // Runtime (for content loading and slash command routing)
  files: string[]
  command?: string
  agent?: string
  path: string

  // Metadata (osprotocol passthrough)
  license?: string
  compatibility?: unknown
  metadata?: Record<string, unknown>
}

/**
 * Group skills by their category field.
 */
export function groupByCategory(skills: SkillEntry[]): Record<string, SkillEntry[]> {
  return skills.reduce(
    (acc, skill) => {
      const category = skill.category || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, SkillEntry[]>
  )
}
