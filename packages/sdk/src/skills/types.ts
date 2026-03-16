import type { Skill } from '@syner/osprotocol'

export type SkillVisibility = 'public' | 'instance' | 'private'

/**
 * A Skill with its full markdown content loaded.
 * Used when rendering skill details (e.g. in a modal).
 */
export interface SkillContent extends Skill {
  content: string
}

/**
 * Group skills by their metadata.category field.
 */
export function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce(
    (acc, skill) => {
      const category = skill.metadata?.category || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )
}
