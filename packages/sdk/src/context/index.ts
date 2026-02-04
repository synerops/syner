/**
 * Context module exports
 *
 * Read-only APIs for gathering information
 */

export type Context = Record<string, unknown>

// Memory
export * as memory from './memory'

// Documents
export * as documents from './documents'