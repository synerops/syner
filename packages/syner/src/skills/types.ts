// Re-export Skill from osprotocol — the canonical spec definition
export type { Skill } from '@syner/osprotocol'

export function groupByCategory<T extends { metadata?: Record<string, unknown> }>(skills: T[]): Record<string, T[]> {
  return skills.reduce(
    (acc, skill) => {
      const category = (skill.metadata?.category as string) || 'Other'
      if (!acc[category]) acc[category] = []
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, T[]>
  )
}
