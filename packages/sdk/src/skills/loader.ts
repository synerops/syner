import { glob } from 'glob'
import matter from 'gray-matter'
import { parseSkillManifest } from '@syner/osprotocol'
import { readFile } from 'fs/promises'
import path from 'path'
import type { Skill, SkillContent, SkillVisibility } from './types'

// Predefined allowed paths - security: only serve skills from these directories
const SKILL_SOURCES = [
  'skills/syner',
  'apps/vaults/skills',
  'apps/dev/skills',
  'apps/bot/skills',
  'packages/github/skills',
] as const

// Category mapping based on path
const CATEGORY_MAP: Record<string, string> = {
  'skills/syner': 'Orchestration',
  'apps/vaults/skills': 'Vaults',
  'apps/dev/skills': 'Dev',
  'apps/bot/skills': 'Bot',
  'packages/github/skills': 'Auth',
}

interface SkillsRegistry {
  skills: Map<string, { skill: Skill; path: string }>
  list: Skill[]
}

// Singleton cache
let cachedRegistry: SkillsRegistry | null = null
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

async function buildRegistry(projectRoot: string): Promise<SkillsRegistry> {
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
        const { skill: manifest } = parseSkillManifest(content)

        const slug = getSlugFromPath(filePath)
        const category = getCategoryFromPath(filePath)

        if (manifest.name && manifest.name !== slug) {
          console.warn(
            `Skill "${slug}": manifest name "${manifest.name}" does not match directory "${slug}". ` +
            `Per Agent Skills spec, name should match the directory.`
          )
        }

        const visibility: SkillVisibility = (manifest.metadata?.visibility as SkillVisibility) || 'instance'

        const skill: Skill = {
          slug,
          name: manifest.name || slug,
          description: manifest.description || '',
          category,
          version: manifest.metadata?.version,
          author: manifest.metadata?.author,
          visibility,
          manifest,
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

export function invalidateSkillsCache(): void {
  cachedRegistry = null
  cachedProjectRoot = null
}

export async function getSkillsRegistry(projectRoot: string): Promise<SkillsRegistry> {
  // Invalidate cache if project root changed
  if (cachedRegistry && cachedProjectRoot === projectRoot) {
    return cachedRegistry
  }
  cachedRegistry = await buildRegistry(projectRoot)
  cachedProjectRoot = projectRoot
  return cachedRegistry
}

export async function getSkillsList(projectRoot: string): Promise<Skill[]> {
  const index = await getSkillsRegistry(projectRoot)
  return index.list
}

export async function getSkillBySlug(projectRoot: string, slug: string): Promise<SkillContent | null> {
  // Security: validate slug format
  if (!VALID_SLUG.test(slug)) {
    return null
  }

  const index = await getSkillsRegistry(projectRoot)
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

export async function getPublicSkills(projectRoot: string): Promise<Skill[]> {
  const { list } = await getSkillsRegistry(projectRoot)
  return list.filter((s) => s.visibility === 'public')
}

export async function getInstanceSkills(projectRoot: string): Promise<Skill[]> {
  const { list } = await getSkillsRegistry(projectRoot)
  return list.filter((s) => s.visibility === 'instance' || s.visibility === 'public')
}

export async function getPrivateSkills(projectRoot: string, app: string): Promise<Skill[]> {
  const { list } = await getSkillsRegistry(projectRoot)
  const appSource = `apps/${app}/skills`
  return list.filter((s) => {
    if (s.visibility !== 'private') return false
    const entry = cachedRegistry?.skills.get(s.slug)
    return entry?.path.includes(appSource)
  })
}

export function getCategories(skills: Skill[]): string[] {
  const categories = new Set(skills.map((s) => s.category))
  return Array.from(categories).sort()
}
