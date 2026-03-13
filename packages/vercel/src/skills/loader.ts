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
  /** Command name to expose as slash command (e.g., 'create-skill' for /syner create-skill) */
  command?: string
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
 * Supports both `tools` and `allowed-tools` frontmatter keys,
 * and `agent` at root or nested under `metadata`.
 */
function parseSkillFile(filePath: string): SkillConfig {
  const content = readFileSync(filePath, 'utf-8')
  const { data, content: body } = matter(content)

  return {
    name: data.name || path.basename(path.dirname(filePath)),
    description: data.description,
    instructions: body.trim(),
    tools: data.tools || data['allowed-tools'],
    agent: data.agent || data.metadata?.agent,
    context: data.context || 'inline',
    filePath,
    command: data.command,
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

/**
 * Command configuration for slash commands
 */
export interface CommandConfig {
  name: string
  skillName: string
  description: string
  agent: string
}

/**
 * Discover all skills that are exposed as slash commands
 * Scans all skill directories for skills with `command:` in frontmatter
 */
export async function discoverCommandSkills(repoRoot: string): Promise<CommandConfig[]> {
  const commands: CommandConfig[] = []

  for (const dir of SKILL_DIRS) {
    const pattern = path.join(repoRoot, dir, '*/SKILL.md')
    const files = await glob(pattern)

    for (const file of files) {
      try {
        const skill = parseSkillFile(file)

        // Only include skills with command frontmatter
        if (skill.command) {
          commands.push({
            name: skill.command,
            skillName: skill.name,
            description: skill.description || `Invoke ${skill.name} skill`,
            agent: skill.agent || 'syner',
          })
        }
      } catch (error) {
        console.error(`[discoverCommandSkills] Error parsing ${file}:`, error)
      }
    }
  }

  return commands
}
