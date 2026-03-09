import { readFileSync, existsSync } from 'fs'
import { glob } from 'glob'
import matter from 'gray-matter'
import path from 'path'

export interface SkillConfig {
  name: string
  description?: string
  instructions: string
  tools?: string[]
  agent?: string
  context?: 'inline' | 'fork'
  filePath: string
}

// Skill directories to search (relative to repo root)
const SKILL_DIRS = [
  'skills',           // Shared skills
  'apps/*/skills',    // App-specific skills
]

/**
 * Find skill file by name
 * Searches in all skill directories
 */
async function findSkillPath(repoRoot: string, skillName: string): Promise<string | null> {
  for (const dir of SKILL_DIRS) {
    const pattern = path.join(repoRoot, dir, skillName, 'SKILL.md')
    const files = await glob(pattern)
    if (files.length > 0) {
      return files[0]
    }
  }
  return null
}

/**
 * Parse a skill markdown file
 */
function parseSkillFile(filePath: string): SkillConfig {
  const content = readFileSync(filePath, 'utf-8')
  const { data, content: body } = matter(content)

  return {
    name: data.name || path.basename(path.dirname(filePath)),
    description: data.description,
    instructions: body.trim(),
    tools: data.tools,
    agent: data.agent,
    context: data.context || 'inline',
    filePath,
  }
}

/**
 * Load a specific skill by name
 */
export async function loadSkill(
  repoRoot: string,
  skillName: string
): Promise<SkillConfig | null> {
  const skillPath = await findSkillPath(repoRoot, skillName)
  if (!skillPath || !existsSync(skillPath)) {
    return null
  }
  return parseSkillFile(skillPath)
}

/**
 * Load multiple skills by name
 * Returns a map of skill name -> config
 */
export async function loadSkills(
  repoRoot: string,
  skillNames: string[]
): Promise<Map<string, SkillConfig>> {
  const skills = new Map<string, SkillConfig>()

  for (const name of skillNames) {
    const skill = await loadSkill(repoRoot, name)
    if (skill) {
      skills.set(name, skill)
    }
  }

  return skills
}

/**
 * Build inline skill context for system prompt
 * Includes skill descriptions so the agent knows what's available
 */
export function buildInlineSkillContext(skills: Map<string, SkillConfig>): string {
  if (skills.size === 0) return ''

  const lines = ['## Available Skills', '']
  lines.push('You have access to the following skills. To use a skill, follow its instructions when the task matches its purpose.', '')

  for (const [name, skill] of skills) {
    lines.push(`### /${name}`)
    if (skill.description) {
      lines.push(skill.description)
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Build full skill instructions for fork mode
 * Includes complete skill content, not just description
 */
export function buildSkillInstructions(
  skill: SkillConfig,
  args: string
): string {
  // Replace argument placeholders
  let instructions = skill.instructions
    .replace(/\$ARGUMENTS/g, args)
    .replace(/\$(\d+)/g, (_, n) => {
      const argList = args.split(' ')
      return argList[parseInt(n)] || ''
    })

  return instructions
}
