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

  /** Markdown description of all skills for system prompt injection */
  describe(): string {
    if (this.size === 0) return ''

    const lines = [
      '## Available Skills',
      '',
      'You can load specialized instructions using the Skill tool.',
      'Call it when a task matches one of these skills:',
      '',
    ]

    for (const [, skill] of this) {
      lines.push(`- **${skill.name}**: ${skill.description}`)
    }

    return lines.join('\n')
  }
}
