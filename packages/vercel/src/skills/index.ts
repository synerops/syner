import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SkillDescriptor {
  name: string
  description: string
  files: string[]
  command?: string
  agent?: string
}

export interface SkillIndex {
  skills: SkillDescriptor[]
}

export interface CommandInfo {
  skillName: string
  description: string
  agent: string
}

// ---------------------------------------------------------------------------
// SkillsMap — domain-aware collection
// ---------------------------------------------------------------------------

export class SkillsMap extends Map<string, SkillDescriptor> {
  /** Return skills that expose a slash command */
  commands(): Map<string, CommandInfo> {
    const cmds = new Map<string, CommandInfo>()
    for (const [name, entry] of this) {
      if (entry.command) {
        cmds.set(entry.command, {
          skillName: name,
          description: entry.description,
          agent: entry.agent || 'syner',
        })
      }
    }
    return cmds
  }
}

// ---------------------------------------------------------------------------
// SkillLoader
// ---------------------------------------------------------------------------

export interface SkillLoaderOptions {
  /** Path to the skills index.json */
  indexPath: string
  /** Base directories where skill directories live */
  skillDirs: string[]
}

export class SkillLoader {
  private index: SkillIndex | null = null
  private skillMap: SkillsMap = new SkillsMap()
  private skillDirs: string[]
  private indexPath: string
  private loaded = false

  constructor(options: SkillLoaderOptions) {
    this.skillDirs = options.skillDirs
    this.indexPath = options.indexPath
  }

  /** Load index from disk (call once, before using other methods) */
  async load(): Promise<void> {
    if (this.loaded) return
    this.index = await loadIndex(this.indexPath)
    this.skillMap = new SkillsMap(this.index.skills.map(s => [s.name, s]))
    this.loaded = true
  }

  /** The SkillsMap — exposes domain methods like commands() */
  get skills(): SkillsMap {
    return this.skillMap
  }

  /** All available skill names */
  get names(): string[] {
    return this.index?.skills.map(s => s.name) ?? []
  }

  /** Check if a skill exists in the index */
  has(name: string): boolean {
    return this.skillMap.has(name)
  }

  /** Get a skill entry by name */
  getEntry(name: string): SkillDescriptor | undefined {
    return this.skillMap.get(name)
  }

  /** Skill descriptions for system prompt injection */
  describeSkills(): string {
    if (!this.index || this.index.skills.length === 0) return ''

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

  /** Load full skill content (SKILL.md + support files) as XML-wrapped context */
  async loadContent(name: string): Promise<string | null> {
    const entry = this.skillMap.get(name)
    if (!entry) return null

    const skillDir = findSkillDir(this.skillDirs, name)
    if (!skillDir) return null

    return loadSkillContent(skillDir, entry)
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function loadIndex(indexPath: string): Promise<SkillIndex> {
  if (!existsSync(indexPath)) {
    return { skills: [] }
  }
  const content = await readFile(indexPath, 'utf-8')
  return JSON.parse(content)
}

/** Deterministic lookup only — no glob fallback */
export function findSkillDir(skillDirs: string[], skillName: string): string | null {
  for (const dir of skillDirs) {
    const candidate = path.join(dir, skillName, 'SKILL.md')
    if (existsSync(candidate)) {
      return path.join(dir, skillName)
    }
  }
  return null
}

export async function loadSkillContent(skillDir: string, entry: SkillDescriptor): Promise<string> {
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

  return parts.join('\n\n')
}
