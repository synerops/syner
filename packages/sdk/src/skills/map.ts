import type { Skill } from '@syner/osprotocol'

export interface CommandInfo {
  skillName: string
  description: string
  agent: string
}

export class SkillsMap extends Map<string, Skill> {
  commands(): Map<string, CommandInfo> {
    const cmds = new Map<string, CommandInfo>()
    for (const [name, skill] of this) {
      const command = skill.metadata?.command as string | undefined
      if (command) {
        cmds.set(command, {
          skillName: name,
          description: skill.description,
          agent: (skill.metadata?.agent as string) || 'syner',
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

export type { Skill } from '@syner/osprotocol'

export function groupByCategory<T extends { metadata?: Record<string, unknown> }>(skills: T[]): Record<string, T[]> {
  return skills.reduce(
    (acc, skill) => {
      const category = (skill.metadata?.category as string) || 'Other'
      if (!acc[category]) acc[category] = []
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, T[]>
  )
}
