/**
 * Syner Context - Opinionated context gathering with smart defaults
 * @implements @syner/sdk/context
 */

import type { MemoryContext } from "@syner/sdk/context"
import { DefaultContextAgent } from "@syner/sdk/context"

import { InMemoryProvider } from "./memory/providers"
import { createMemoryTools } from "./memory/tools"

export interface ContextAgentOptions {
  /**
   * LLM model to use
   * @default "openai/gpt-4o-mini"
   */
  model?: string
  /**
   * Memory provider implementation
   * @default InMemoryProvider
   */
  memory?: MemoryContext
}

/**
 * Create a context agent with Syner's opinionated defaults
 */
export function createContextAgent(options?: ContextAgentOptions) {
  // Create memory provider
  const memory = options?.memory ?? new InMemoryProvider()

  // Create memory tools for LLM
  const memoryTools = createMemoryTools(memory)

  // Create agent with tools
  const agent = new DefaultContextAgent({
    model: options?.model ?? "openai/gpt-4o-mini",
    tools: memoryTools as any, // Cast needed for AI SDK tool compatibility
  })

  // Register memory API for direct access
  agent.registerAPI("memory", memory)

  // Add memory-specific guidelines
  agent.createGuideline({
    condition: "User asks to remember, save, store, or keep in mind",
    action: "Use memory_set tool to store information with relevant tags",
    apis: ["memory_set"],
    priority: 100,
  })

  agent.createGuideline({
    condition: "User asks to recall, what did, do you remember, or what was",
    action: "Use memory_search or memory_get tool to retrieve information",
    apis: ["memory_search", "memory_get"],
    priority: 95,
  })

  agent.createGuideline({
    condition: "User references past conversation or previous work",
    action: "Use memory_search tool with relevant query and tags",
    apis: ["memory_search"],
    priority: 90,
  })

  return agent
}
