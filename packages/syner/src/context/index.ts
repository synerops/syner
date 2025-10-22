/**
 * Context namespace
 * Everything related to context gathering and memory
 */

// # Agent

export { createContextAgent } from "./context"
export type { ContextAgentOptions } from "./context"

// # Memory

// ## memory/providers/
export { InMemoryProvider } from "./memory/providers"

// ## memory/tools
export { createMemoryTools } from "./memory/tools"

// # Re-exports (@syner/sdk)

export type { Memory, MemoryContext, MemorySearchOptions } from "@syner/sdk"
export { DefaultMemoryProvider } from "@syner/sdk/context"
