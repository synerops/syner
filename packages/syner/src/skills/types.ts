export interface Skill {
  slug: string
  name: string
  description: string
  category: string
  version?: string
  author?: string
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
