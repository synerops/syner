/**
 * Skill — aligned with the agentskills.io specification.
 *
 * Custom fields (slug, category, visibility, command, agent) live in metadata.
 * Runtime internals (path, files) live in @syner/sdk only.
 */
export interface Skill {
  name: string
  description: string
  license?: string
  compatibility?: string
  metadata?: Record<string, unknown>
}

export function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce(
    (acc, skill) => {
      const category = (skill.metadata?.category as string) || 'Other'
      if (!acc[category]) acc[category] = []
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )
}
