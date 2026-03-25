/** @deprecated Use syner/registry — skill loader moved to packages/syner in v0.1.1 */
import { glob } from 'glob'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import matter from 'gray-matter'
import { parseSkillManifest } from '@syner/osprotocol'
import path from 'path'
import { createRegistry } from '../registry'
import { SKILL_SOURCES, CATEGORY_MAP } from './sources'
import type { SkillDiscovery } from './types'
import type { Skill } from '@syner/osprotocol'

/** Subdirectories to include as support files alongside SKILL.md */
const SUPPORT_DIRS = ['scripts', 'references', 'assets'] as const

/** Strip internal fields — returns spec-compliant Skill */
function toSkill(entry: SkillDiscovery): Skill {
  return {
    name: entry.name,
    description: entry.description,
    license: entry.license,
    compatibility: entry.compatibility,
    metadata: entry.metadata,
  }
}

const _registry = createRegistry<SkillDiscovery>({
  key: (skill) => (skill.metadata?.slug as string) || skill.name,

  async discover(root) {
    const result: SkillDiscovery[] = []

    for (const source of SKILL_SOURCES) {
      const sourceDir = path.resolve(root, source)
      if (!existsSync(sourceDir)) continue

      const pattern = path.join(sourceDir, '**/SKILL.md')
      const skillFiles = await glob(pattern)

      for (const file of skillFiles) {
        const resolved = path.resolve(file)
        if (!resolved.startsWith(sourceDir)) {
          console.warn(`Skipping file outside allowed directory: ${file}`)
          continue
        }

        try {
          const raw = await readFile(resolved, 'utf-8')
          const { data: frontmatter } = matter(raw)
          const { skill: manifest } = parseSkillManifest(raw)

          const skillDir = path.dirname(resolved)
          const slug = path.basename(skillDir)
          const category = CATEGORY_MAP[source] || 'Other'
          const visibility = (manifest.metadata?.visibility as string) || 'instance'

          // Collect support files
          const files = ['SKILL.md']
          for (const supportDir of SUPPORT_DIRS) {
            const supportPath = path.join(skillDir, supportDir)
            if (!existsSync(supportPath)) continue
            const supportFiles = await glob(path.join(supportPath, '**/*'), { nodir: true })
            for (const f of supportFiles) files.push(path.relative(skillDir, f))
          }

          result.push({
            name: manifest.name || slug,
            description: manifest.description || '',
            license: manifest.license,
            compatibility: manifest.compatibility,
            metadata: { ...manifest.metadata, slug, category, visibility, command: frontmatter.command, agent: frontmatter.agent },
            path: resolved,
            files,
          })
        } catch (error) {
          console.error(`Error parsing ${file}:`, error)
        }
      }
    }

    return result.sort((a, b) => {
      const catA = (a.metadata?.category as string) || 'Other'
      const catB = (b.metadata?.category as string) || 'Other'
      return catA !== catB ? catA.localeCompare(catB) : a.name.localeCompare(b.name)
    })
  },
})

/**
 * Skills registry.
 *
 *   await skills.list()                              → Skill[]
 *   await skills.get('create-syner-app')             → Skill | undefined
 *   await skills.read('create-syner-app')            → Skill & { content } | null
 *   await skills.filter(s => s.metadata?.visibility === 'public')
 */
export const skills = {
  list: () => _registry.list().then(entries => entries.map(toSkill)),
  get: (key: string) => _registry.get(key).then(e => e ? toSkill(e) : undefined),
  filter: (fn: (s: Skill) => boolean) => skills.list().then(list => list.filter(fn)),
  find: (fn: (s: Skill) => boolean) => skills.list().then(list => list.find(fn)),
  entries: () => _registry.entries().then(map => {
    const result = new Map<string, Skill>()
    for (const [k, v] of map) result.set(k, toSkill(v))
    return result
  }),
  invalidate: () => _registry.invalidate(),

  /** Load full markdown content for a skill */
  async read(key: string): Promise<(Skill & { content: string }) | null> {
    const entry = await _registry.get(key)
    if (!entry) return null
    try {
      const raw = await readFile(entry.path, 'utf-8')
      const { content } = matter(raw)
      return { ...toSkill(entry), content: content.trim() }
    } catch {
      return null
    }
  },
}
