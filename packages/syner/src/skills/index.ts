import type { SkillEntry } from './types'

export interface CommandInfo {
  skillName: string
  description: string
  agent: string
}

export class SkillsMap extends Map<string, SkillEntry> {
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

export type { SkillEntry, SkillVisibility } from './types'
export { groupByCategory } from './types'
