/**
 * Syner - The Fullstack Agent
 * @implements @syner/sdk
 */

// ============================================
// Core Exports
// ============================================

export { createContextAgent } from "./context";
export { createFullstackAgent } from "./fullstack-engineer";

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

export { InMemoryProvider } from "./context/memory/providers";

// For advanced users who want to extend providers
export { DefaultMemoryProvider } from "@syner/sdk/context";

// ============================================
// Tools (for custom LLM integrations)
// ============================================

export { createMemoryTools } from "./context/memory/tools";
