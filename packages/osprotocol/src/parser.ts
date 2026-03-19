import matter from 'gray-matter'
import type { Skill } from './types/skill'

export interface ParseResult {
  skill: Skill
  warnings: string[]
}

export function parseSkillManifest(content: string): ParseResult {
  const { data } = matter(content)
  const warnings: string[] = []

  const skill: Skill = {
    name: data.name || '',
    description: data.description || '',
  }

  if (data.license) skill.license = data.license
  if (data.compatibility) skill.compatibility = data.compatibility

  if (data.metadata && typeof data.metadata === 'object') {
    const meta: Record<string, string> = {}
    for (const [key, value] of Object.entries(data.metadata)) {
      meta[key] = String(value)
    }
    skill.metadata = meta
  }

  if (!data.name) warnings.push('missing required field: name')
  if (!data.description) warnings.push('missing required field: description')

  return { skill, warnings }
}
