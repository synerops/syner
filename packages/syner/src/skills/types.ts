import type { SkillManifestV2 } from '@syner/osprotocol'

export type SkillVisibility = 'public' | 'instance' | 'private'

export interface Skill {
  slug: string
  name: string
  description: string
  category: string
  version?: string
  author?: string
  visibility: SkillVisibility
  manifest?: SkillManifestV2
}

export interface SkillContent extends Skill {
  content: string
}

export function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )
}
