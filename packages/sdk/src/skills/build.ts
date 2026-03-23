import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import type { SkillDiscovery } from './types'

/**
 * Build pre-rendered content for a single skill.
 * Reads SKILL.md + support files and wraps in XML tags for LLM injection.
 */
export async function buildSkillContent(entry: SkillDiscovery): Promise<{ content: string } | null> {
  const skillDir = path.dirname(entry.path)
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
