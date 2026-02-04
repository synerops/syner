/**
 * Core types for the Syner SDK
 *
 * These types define the foundational contracts for skills, tools, and the runtime.
 */

import type { Tool } from 'ai'

/**
 * Protocol domains as defined in OS Protocol
 */
export type ProtocolDomain = 'system' | 'context' | 'actions' | 'checks' | 'skills' | 'workflows' | 'runs'

/**
 * SKILL.md frontmatter metadata
 */
export interface SkillMetadata {
  name: string
  description: string
  protocol: {
    domain: ProtocolDomain
    api: string
  }
  extends?: string
}

/**
 * Parsed skill definition from SKILL.md
 */
export interface SkillDefinition {
  metadata: SkillMetadata
  content: string
  path: string
}

/**
 * A loaded skill with its tools ready for use
 */
export interface LoadedSkill {
  definition: SkillDefinition
  tools: Record<string, Tool>
}

/**
 * Tool execution result
 */
export interface ToolResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Skill registry entry
 */
export interface SkillRegistryEntry {
  name: string
  domain: ProtocolDomain
  api: string
  path: string
  loaded: boolean
}

/**
 * Runtime configuration
 */
export interface RuntimeConfig {
  basePath: string
  extensions?: string[]
}
