import { glob } from 'glob'
import matter from 'gray-matter'
import { readFile } from 'fs/promises'
import path from 'path'
import type { Skill, SkillContent } from './types'

// Predefined allowed paths - security: only serve skills from these directories
const SKILL_SOURCES = [
  'skills/syner',
  'apps/notes/skills',
  'apps/dev/skills',
  'apps/bot/skills',
  'packages/github/skills',
] as const

// Category mapping based on path
const CATEGORY_MAP: Record<string, string> = {
  'skills/syner': 'Orchestration',
  'apps/notes/skills': 'Notes',
  'apps/dev/skills': 'Dev',
  'apps/bot/skills': 'Bot',
  'packages/github/skills': 'Auth',
}

interface SkillsIndex {
  skills: Map<string, { skill: Skill; path: string }>
  list: Skill[]
}

// Singleton cache for skills index
let cachedIndex: SkillsIndex | null = null
let cachedProjectRoot: string | null = null

// Validation: only alphanumeric and hyphens
const VALID_SLUG = /^[a-z0-9-]+$/

function getCategoryFromPath(filePath: string): string {
  for (const [source, category] of Object.entries(CATEGORY_MAP)) {
    if (filePath.includes(source)) {
      return category
    }
  }
  return 'Other'
}

function getSlugFromPath(filePath: string): string {
  // Extract skill name from path like "apps/dev/skills/create-syner-app/SKILL.md"
  const parts = filePath.split('/')
  const skillIndex = parts.indexOf('SKILL.md')
  if (skillIndex > 0) {
    return parts[skillIndex - 1]
  }
  // Fallback for skills/syner/SKILL.md pattern
  if (parts.includes('syner') && parts.includes('skills')) {
    const synerIndex = parts.lastIndexOf('syner')
    return parts[synerIndex]
  }
  return parts[parts.length - 2]
}

async function buildIndex(projectRoot: string): Promise<SkillsIndex> {
  const skills = new Map<string, { skill: Skill; path: string }>()
  const list: Skill[] = []

  // Scan all allowed paths
  for (const source of SKILL_SOURCES) {
    const pattern = path.join(projectRoot, source, '**/SKILL.md')
    const files = await glob(pattern)

    for (const filePath of files) {
      // Security: verify path is within allowed directories
      const resolved = path.resolve(filePath)
      const sourceResolved = path.resolve(projectRoot, source)
      if (!resolved.startsWith(sourceResolved)) {
        console.warn(`Skipping file outside allowed directory: ${filePath}`)
        continue
      }

      try {
        const content = await readFile(filePath, 'utf-8')
        const { data } = matter(content)

        const slug = getSlugFromPath(filePath)
        const category = getCategoryFromPath(filePath)

        const skill: Skill = {
          slug,
          name: data.name || slug,
          description: data.description || '',
          category,
          version: data.metadata?.version,
          author: data.metadata?.author,
        }

        skills.set(slug, { skill, path: filePath })
        list.push(skill)
      } catch (error) {
        console.error(`Error parsing ${filePath}:`, error)
      }
    }
  }

  // Sort by category, then by name
  list.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.name.localeCompare(b.name)
  })

  return { skills, list }
}

export async function getSkillsIndex(projectRoot: string): Promise<SkillsIndex> {
  // Invalidate cache if project root changed
  if (cachedIndex && cachedProjectRoot === projectRoot) {
    return cachedIndex
  }
  cachedIndex = await buildIndex(projectRoot)
  cachedProjectRoot = projectRoot
  return cachedIndex
}

export async function getSkillsList(projectRoot: string): Promise<Skill[]> {
  const index = await getSkillsIndex(projectRoot)
  return index.list
}

export async function getSkillBySlug(projectRoot: string, slug: string): Promise<SkillContent | null> {
  // Security: validate slug format
  if (!VALID_SLUG.test(slug)) {
    return null
  }

  const index = await getSkillsIndex(projectRoot)
  const entry = index.skills.get(slug)

  if (!entry) {
    return null
  }

  // Security: double-check path is within allowed directories
  const resolved = path.resolve(entry.path)
  const isAllowed = SKILL_SOURCES.some((source) => {
    const sourceResolved = path.resolve(projectRoot, source)
    return resolved.startsWith(sourceResolved)
  })

  if (!isAllowed) {
    return null
  }

  try {
    const fileContent = await readFile(entry.path, 'utf-8')
    const { content } = matter(fileContent)

    return {
      ...entry.skill,
      content,
    }
  } catch {
    return null
  }
}

export function getCategories(skills: Skill[]): string[] {
  const categories = new Set(skills.map((s) => s.category))
  return Array.from(categories).sort()
}
