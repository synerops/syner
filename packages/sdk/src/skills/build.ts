import { glob } from 'glob'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { parseSkillManifest } from '@syner/osprotocol'

export interface SkillIndexEntry {
  name: string
  description: string
  files: string[]
  command?: string
  agent?: string
}

export interface SkillIndex {
  skills: SkillIndexEntry[]
}

/** Subdirectories to include as support files alongside SKILL.md */
const SUPPORT_DIRS = ['scripts', 'references', 'assets'] as const

/**
 * Scan skill directories and build a static skills manifest.
 *
 * For each directory containing a SKILL.md, parses frontmatter and
 * collects support files (scripts/, references/, assets/).
 *
 * Output follows the agentskills.io pattern:
 * ```json
 * { "skills": [{ "name": "...", "description": "...", "files": ["SKILL.md", ...] }] }
 * ```
 */
export async function buildSkillsManifest(skillDirs: string[]): Promise<SkillIndex> {
  const skills: SkillIndexEntry[] = []

  for (const dir of skillDirs) {
    const resolved = path.resolve(dir)
    if (!existsSync(resolved)) continue

    // Find all SKILL.md files
    const pattern = path.join(resolved, '**/SKILL.md')
    const skillFiles = await glob(pattern)

    for (const skillFile of skillFiles) {
      try {
        const content = await readFile(skillFile, 'utf-8')
        const { data: frontmatter } = matter(content)
        const { skill: manifest } = parseSkillManifest(content)

        const skillDir = path.dirname(skillFile)
        const name = manifest.name || path.basename(skillDir)
        const description = manifest.description || ''

        // Collect all files: SKILL.md + support directories
        const files = ['SKILL.md']

        for (const supportDir of SUPPORT_DIRS) {
          const supportPath = path.join(skillDir, supportDir)
          if (!existsSync(supportPath)) continue

          const supportFiles = await glob(path.join(supportPath, '**/*'), { nodir: true })
          for (const f of supportFiles) {
            files.push(path.relative(skillDir, f))
          }
        }

        const entry: SkillIndexEntry = { name, description, files }
        if (frontmatter.command) entry.command = frontmatter.command
        if (frontmatter.agent) entry.agent = frontmatter.agent
        skills.push(entry)
      } catch (error) {
        console.error(`[buildSkillsManifest] Error parsing ${skillFile}:`, error)
      }
    }
  }

  // Sort by name for deterministic output
  skills.sort((a, b) => a.name.localeCompare(b.name))

  return { skills }
}
