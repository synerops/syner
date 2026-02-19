/**
 * Core module exports
 */

// Types
export type {
  ToolResult,
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

// Runtime - removed (SKILL.md no longer exists in OSP)
