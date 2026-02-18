/**
 * Core types for the Syner SDK
 */

/**
 * Tool execution result
 */
export interface ToolResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Runtime configuration
 */
export interface RuntimeConfig {
  basePath: string
  extensions?: string[]
  /** Project root directory for security scoping */
  projectRoot?: string
}
