import type { Skill } from 'syner/skills'

/**
 * Internal SDK type for skill discovery — extends Skill with filesystem details.
 *
 * These fields are needed by the registry and build tools but never
 * exposed to consumers or sent over the wire.
 */
export interface SkillDiscovery extends Skill {
  path: string       // absolute path to SKILL.md
  files: string[]    // SKILL.md + support files (scripts/, references/, assets/)
}

// Re-export Skill from syner for convenience
export type { Skill } from 'syner/skills'
