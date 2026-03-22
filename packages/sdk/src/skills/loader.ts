import { glob } from 'glob'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import matter from 'gray-matter'
import { parseSkillManifest } from '@syner/osprotocol'
import path from 'path'
import { createRegistry } from '../registry'
import { SKILL_SOURCES, CATEGORY_MAP } from './sources'
import type { SkillEntry, SkillVisibility } from './types'

/** Subdirectories to include as support files alongside SKILL.md */
const SUPPORT_DIRS = ['scripts', 'references', 'assets'] as const


/**
 * Skills registry — discovers SKILL.md files from predefined source directories.
 *
 * Usage:
 *   await skills.list()
 *   await skills.get('create-syner-app')
 *   await skills.filter(s => s.visibility === 'public')
 *   await skills.filter(s => s.category === 'Orchestration')
 */
const _registry = createRegistry<SkillEntry>({
  key: (skill) => skill.slug,

  async discover(root) {
    const result: SkillEntry[] = []

    for (const source of SKILL_SOURCES) {
      const sourceDir = path.resolve(root, source)
      if (!existsSync(sourceDir)) continue

      const pattern = path.join(sourceDir, '**/SKILL.md')
      const skillFiles = await glob(pattern)

      for (const file of skillFiles) {
        // Security: verify path is within allowed directories
        const resolved = path.resolve(file)
        if (!resolved.startsWith(sourceDir)) {
          console.warn(`Skipping file outside allowed directory: ${file}`)
          continue
        }

        try {
          const raw = await readFile(resolved, 'utf-8')
          const { data: frontmatter, content: body } = matter(raw)
          const { skill: manifest } = parseSkillManifest(raw)

          const skillDir = path.dirname(resolved)
          const slug = path.basename(skillDir)
          const category = CATEGORY_MAP[source] || 'Other'
          const visibility: SkillVisibility = (manifest.metadata?.visibility as SkillVisibility) || 'instance'

          // Collect support files: SKILL.md + scripts/, references/, assets/
          const files = ['SKILL.md']
          for (const supportDir of SUPPORT_DIRS) {
            const supportPath = path.join(skillDir, supportDir)
            if (!existsSync(supportPath)) continue
            const supportFiles = await glob(path.join(supportPath, '**/*'), { nodir: true })
            for (const f of supportFiles) files.push(path.relative(skillDir, f))
          }

          result.push({
            name: manifest.name || slug,
            slug,
            description: manifest.description || '',
            category,
            visibility,
            content: body.trim(),
            files,
            command: frontmatter.command,
            agent: frontmatter.agent,
            path: resolved,
            license: manifest.license,
            compatibility: manifest.compatibility,
            metadata: { ...manifest.metadata, slug, category, visibility },
          })
        } catch (error) {
          console.error(`Error parsing ${file}:`, error)
        }
      }
    }

    return result.sort((a, b) =>
      a.category !== b.category
        ? a.category.localeCompare(b.category)
        : a.name.localeCompare(b.name)
    )
  },
})

/**
 * Skills registry — discovers SKILL.md files with full content.
 *
 * Usage:
 *   await skills.list()
 *   await skills.get('create-syner-app')   // includes content
 *   await skills.filter(s => s.visibility === 'public')
 *   await skills.filter(s => s.category === 'Orchestration')
 */
export const skills = _registry
