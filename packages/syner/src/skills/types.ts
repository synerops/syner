export type SkillVisibility = 'public' | 'instance' | 'private'

export interface SkillEntry {
  name: string
  slug: string
  description: string
  category: string
  visibility: SkillVisibility
  content: string
  files: string[]
  command?: string
  agent?: string
  path: string
  license?: string
  compatibility?: unknown
  metadata?: Record<string, unknown>
}

export function groupByCategory(skills: SkillEntry[]): Record<string, SkillEntry[]> {
  return skills.reduce(
    (acc, skill) => {
      const category = skill.category || 'Other'
      if (!acc[category]) acc[category] = []
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, SkillEntry[]>
  )
}
