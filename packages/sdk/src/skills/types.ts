import type { Skill } from '@syner/osprotocol'

/**
 * Internal SDK type for skill discovery — extends Skill with filesystem details.
 * Never exposed to consumers or sent over the wire.
 */
export interface SkillDiscovery extends Skill {
  path: string       // absolute path to SKILL.md
  files: string[]    // SKILL.md + support files
}

export type { Skill } from '@syner/osprotocol'
