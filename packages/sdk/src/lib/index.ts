/**
 * Core module exports
 */

// Types
export type {
  ProtocolDomain,
  SkillMetadata,
  SkillDefinition,
  LoadedSkill,
  ToolResult,
  SkillRegistryEntry,
  RuntimeConfig,
} from './types'

// Config
export { findProjectRoot } from './config'

// Security
export {
  SecurityError,
  assertWithinScope,
  resolveSafePath,
  resolveRealPath,
  validateImportPath,
  isWithinAllowedPaths,
  assertWithinAllowedPaths,
} from './security'

// Runtime
export {
  discoverSkills,
  discoverSkillsByDomain,
  discoverSkillsAuto,
  parseSkillFile,
  parseSkillContent,
  loadSkill,
  loadSkillFromRegistry,
  loadSkills,
  loadSkillsSecure,
  getToolsFromSkills,
  getToolsBySkill,
  type LoadToolsOptions,
} from './runtime'
