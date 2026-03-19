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

export interface SkillContentFile {
  content: string
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

/**
 * Build pre-rendered content for a single skill.
 *
 * Reads SKILL.md + support files from the skill directory and wraps them
 * in XML tags for LLM injection. Output is written to {name}.json alongside index.json.
 *
 * Progressive disclosure (agentskills.io):
 * - index.json = metadata at startup (~100 tokens per skill)
 * - {name}.json = full content on activation (<5000 tokens)
 */
export async function buildSkillContent(skillDirs: string[], entry: SkillIndexEntry): Promise<SkillContentFile | null> {
  const skillDir = findSkillDir(skillDirs, entry.name)
  if (!skillDir) return null

  const parts: string[] = []

  for (const file of entry.files) {
    const filePath = path.join(skillDir, file)
    if (!existsSync(filePath)) continue

    try {
      const content = await readFile(filePath, 'utf-8')
      if (file === 'SKILL.md') {
        parts.push(`<skill-instructions name="${entry.name}">\n${content}\n</skill-instructions>`)
      } else {
        parts.push(`<skill-file path="${file}">\n${content}\n</skill-file>`)
      }
    } catch {
      // Skip unreadable files
    }
  }

  if (parts.length === 0) return null
  return { content: parts.join('\n\n') }
}

/** Deterministic skill directory lookup — no glob */
function findSkillDir(skillDirs: string[], skillName: string): string | null {
  for (const dir of skillDirs) {
    const candidate = path.join(dir, skillName, 'SKILL.md')
    if (existsSync(candidate)) {
      return path.join(dir, skillName)
    }
  }
  return null
}
