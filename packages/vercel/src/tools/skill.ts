import { tool } from 'ai'
import { z } from 'zod'
import { readFileSync, existsSync } from 'fs'
import path from 'path'

export interface SkillIndexEntry {
  name: string
  description: string
  files: string[]
}

export interface SkillIndex {
  skills: SkillIndexEntry[]
}

export interface CreateSkillToolOptions {
  /** Path to the skills index.json */
  indexPath: string
  /** Base directory where skill directories live (to resolve file paths) */
  skillDirs: string[]
}

/**
 * Load index.json from disk (called once at agent init).
 */
function loadIndex(indexPath: string): SkillIndex {
  if (!existsSync(indexPath)) {
    return { skills: [] }
  }
  return JSON.parse(readFileSync(indexPath, 'utf-8'))
}

/**
 * Find a skill's directory by scanning skillDirs for its SKILL.md.
 */
function findSkillDir(skillDirs: string[], skillName: string): string | null {
  for (const dir of skillDirs) {
    // Direct match: dir/skillName/SKILL.md
    const candidate = path.join(dir, skillName, 'SKILL.md')
    if (existsSync(candidate)) {
      return path.join(dir, skillName)
    }
    // Nested match: dir/*/skillName/SKILL.md
    const { glob } = require('glob') as typeof import('glob')
    const files = glob.sync(path.join(dir, '**', skillName, 'SKILL.md'))
    if (files.length > 0) {
      return path.dirname(files[0])
    }
  }
  return null
}

/**
 * Load skill content (SKILL.md + support files) and return as XML-wrapped context.
 */
function loadSkillContent(skillDir: string, entry: SkillIndexEntry): string {
  const parts: string[] = []

  for (const file of entry.files) {
    const filePath = path.join(skillDir, file)
    if (!existsSync(filePath)) continue

    try {
      const content = readFileSync(filePath, 'utf-8')
      if (file === 'SKILL.md') {
        parts.push(`<skill-instructions name="${entry.name}">\n${content}\n</skill-instructions>`)
      } else {
        parts.push(`<skill-file path="${file}">\n${content}\n</skill-file>`)
      }
    } catch {
      // Skip unreadable files
    }
  }

  return parts.join('\n\n')
}

/**
 * Create a Skill tool that injects skill instructions into the agent's context.
 *
 * When the agent invokes this tool, it returns the skill's SKILL.md content
 * plus any support files (scripts/, references/, assets/) as XML-wrapped
 * context. No subagent is spawned — the current agent uses the instructions.
 *
 * The tool description dynamically lists available skills from index.json
 * so the LLM knows what's available.
 */
export function createSkillTool(options: CreateSkillToolOptions) {
  const { indexPath, skillDirs } = options

  // Prefetch index at init time
  const index = loadIndex(indexPath)
  const skillNames = index.skills.map(s => s.name)
  const skillMap = new Map(index.skills.map(s => [s.name, s]))

  const skillList = index.skills
    .map(s => `- ${s.name}: ${s.description}`)
    .join('\n')

  const description = skillNames.length > 0
    ? `Load specialized instructions for a skill into your context. Available skills:\n${skillList}`
    : 'Load specialized instructions for a skill into your context. No skills available.'

  const inputSchema = z.object({
    name: z.string().describe('Skill name to load'),
  })

  return tool({
    description,
    inputSchema,
    execute: async ({ name }): Promise<string> => {
      const entry = skillMap.get(name)
      if (!entry) {
        return `Error: Skill "${name}" not found. Available: ${skillNames.join(', ')}`
      }

      const skillDir = findSkillDir(skillDirs, name)
      if (!skillDir) {
        return `Error: Skill "${name}" found in index but directory not found on disk.`
      }

      const content = loadSkillContent(skillDir, entry)
      if (!content) {
        return `Error: Could not load content for skill "${name}".`
      }

      return content
    },
  })
}
