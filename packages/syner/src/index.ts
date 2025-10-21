/**
 * Syner OS - The Fullstack Agent
 * @implements @syner/sdk
 */

// ============================================
// Core Exports
// ============================================

export { context, createContextAgent } from "./context";
export { createFullstackAgent } from "./factories";

// ============================================
// Types (for custom configurations)
// ============================================

export type { ContextAgentOptions } from "./context";

// Re-export SDK types for convenience
export type {
  Memory,
  MemoryContext,
  MemorySearchOptions,
} from "@syner/sdk/context";

// ============================================
// Providers (custom storage backends)
// ============================================

export {
  InMemoryProvider,
  RedisMemoryProvider,
  type RedisMemoryOptions,
} from "./context/providers";

// For advanced users who want to extend providers
export { DefaultMemoryProvider } from "@syner/sdk/context";
