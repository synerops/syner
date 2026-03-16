import { tool } from 'ai'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { z } from 'zod'

export interface SkillIndexEntry {
  name: string
  description: string
  files: string[]
}

export interface SkillIndex {
  skills: SkillIndexEntry[]
}

export interface SkillLoaderOptions {
  /** Path to the skills index.json */
  indexPath: string
  /** Base directories where skill directories live */
  skillDirs: string[]
}

/**
 * Skill loader + tool factory.
 *
 * Hybrid pattern:
 * 1. Skill descriptions always in system prompt (agent knows what's available)
 * 2. Skill tool has NO execute — calling it pauses the loop
 * 3. prepareStep detects the skill call, injects content as user message
 * 4. Agent sees skill content with high attention priority (user message > tool result)
 * 5. Preprocessing for explicit /skillname in user prompts
 */
export class SkillLoader {
  private index: SkillIndex
  private skillMap: Map<string, SkillIndexEntry>
  private skillDirs: string[]

  constructor(options: SkillLoaderOptions) {
    this.skillDirs = options.skillDirs
    this.index = loadIndex(options.indexPath)
    this.skillMap = new Map(this.index.skills.map(s => [s.name, s]))
  }

  /** All available skill names */
  get names(): string[] {
    return this.index.skills.map(s => s.name)
  }

  /** Check if a skill exists in the index */
  has(name: string): boolean {
    return this.skillMap.has(name)
  }

  /** Skill descriptions for system prompt injection */
  describeSkills(): string {
    if (this.index.skills.length === 0) return ''

    const lines = [
      '## Available Skills',
      '',
      'You can load specialized instructions using the Skill tool.',
      'Call it when a task matches one of these skills:',
      '',
    ]

    for (const skill of this.index.skills) {
      lines.push(`- **${skill.name}**: ${skill.description}`)
    }

    return lines.join('\n')
  }

  /**
   * Create the Skill tool — NO execute function.
   *
   * execute returns true (minimal ack) so the loop continues.
   * prepareStep on the next step injects the skill content as a user message.
   *
   * Without execute, the loop would terminate (AI SDK treats no-execute as stop signal).
   */
  createTool() {
    const skillList = this.index.skills
      .map(s => `- ${s.name}: ${s.description}`)
      .join('\n')

    return tool({
      description: this.index.skills.length > 0
        ? `Load specialized instructions for a task. Available skills:\n${skillList}`
        : 'Load specialized instructions. No skills available.',
      inputSchema: z.object({
        name: z.string().describe('Skill name to load'),
      }),
      execute: async () => true,
    })
  }

  /**
   * prepareStep handler — detects Skill tool calls and injects content.
   *
   * Wire this into the ToolLoopAgent's prepareStep:
   * ```ts
   * prepareStep: skillLoader.createPrepareStep()
   * ```
   */
  createPrepareStep() {
    return ({ steps, messages }: { steps: Array<{ toolCalls?: Array<{ toolName: string; toolCallId: string; args: Record<string, unknown> }> }>; messages: Array<Record<string, unknown>>; stepNumber: number; model: unknown; experimental_context: unknown }) => {
      if (steps.length === 0) return {}

      const lastStep = steps[steps.length - 1]
      const skillCall = lastStep?.toolCalls?.find(
        (tc: { toolName: string }) => tc.toolName === 'Skill'
      )
      if (!skillCall) return {}

      const skillName = skillCall.args.name as string

      // Validate against index (no disk I/O)
      if (!this.has(skillName)) return {}

      // Load content from disk
      const content = this.loadContent(skillName)
      if (!content) return {}

      // Inject skill content as user message (high attention priority)
      // execute() already returned true → tool result is in messages
      // We append the skill content as a user message
      return {
        messages: [
          ...messages,
          {
            role: 'user' as const,
            content: content,
          },
        ],
      }
    }
  }

  /** Load full skill content (SKILL.md + support files) as XML-wrapped context */
  loadContent(name: string): string | null {
    const entry = this.skillMap.get(name)
    if (!entry) return null

    const skillDir = findSkillDir(this.skillDirs, name)
    if (!skillDir) return null

    return loadSkillContent(skillDir, entry)
  }

  /**
   * Preprocess a prompt — detect /skillname and prepend content.
   *
   * For explicit skill invocations from the user (e.g., Slack `/deploy`).
   * Returns the prompt unchanged if no skill reference found.
   */
  preprocessPrompt(prompt: string): string {
    const trimmed = prompt.trim()

    if (trimmed.startsWith('/')) {
      const [command, ...rest] = trimmed.split(/\s+/)
      const skillName = command.slice(1)

      // Validate against index before disk I/O
      if (this.has(skillName)) {
        const content = this.loadContent(skillName)
        if (content) {
          const args = rest.join(' ')
          const processed = content
            .replace(/\$ARGUMENTS/g, args)
            .replace(/\$(\d+)/g, (_, n) => rest[parseInt(n)] || '')

          return `${processed}\n\n---\n\nUser request: ${args || trimmed}`
        }
      }
    }

    return prompt
  }
}

// --- Internal helpers ---

function loadIndex(indexPath: string): SkillIndex {
  if (!existsSync(indexPath)) {
    return { skills: [] }
  }
  return JSON.parse(readFileSync(indexPath, 'utf-8'))
}

function findSkillDir(skillDirs: string[], skillName: string): string | null {
  for (const dir of skillDirs) {
    const candidate = path.join(dir, skillName, 'SKILL.md')
    if (existsSync(candidate)) {
      return path.join(dir, skillName)
    }
    const { glob } = require('glob') as typeof import('glob')
    const files = glob.sync(path.join(dir, '**', skillName, 'SKILL.md'))
    if (files.length > 0) {
      return path.dirname(files[0])
    }
  }
  return null
}

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
