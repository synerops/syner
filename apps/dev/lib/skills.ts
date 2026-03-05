import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Skill {
  name: string
  description: string
  category: string
}

const REPO_ROOT = path.join(process.cwd(), '../..')

const SKILL_SOURCES = [
  { dir: path.join(REPO_ROOT, 'skills/syner'), category: 'Orchestration', flat: true },
  { dir: path.join(REPO_ROOT, 'apps/dev/skills'), category: 'Dev', flat: false },
  { dir: path.join(REPO_ROOT, 'apps/notes/skills'), category: 'Notes', flat: false },
  { dir: path.join(REPO_ROOT, 'packages/github/skills'), category: 'Auth', flat: false },
] as const

function readSkill(skillPath: string, category: string): Skill | null {
  try {
    const content = fs.readFileSync(skillPath, 'utf-8')
    const { data } = matter(content)
    if (!data.name || !data.description) return null
    return { name: String(data.name), description: String(data.description), category }
  } catch {
    return null
  }
}

export function getSkills(): Skill[] {
  const skills: Skill[] = []

  for (const source of SKILL_SOURCES) {
    if (source.flat) {
      const skill = readSkill(path.join(source.dir, 'SKILL.md'), source.category)
      if (skill) skills.push(skill)
    } else {
      try {
        const entries = fs.readdirSync(source.dir, { withFileTypes: true })
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const skill = readSkill(
              path.join(source.dir, entry.name, 'SKILL.md'),
              source.category
            )
            if (skill) skills.push(skill)
          }
        }
      } catch {
        // Directory not found, skip
      }
    }
  }

  return skills
}

export function getSkillsByCategory(): Record<string, Skill[]> {
  return getSkills().reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})
}
