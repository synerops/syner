/**
 * Syner Context - Opinionated context gathering with smart defaults
 * @implements @syner/sdk/context
 */

import type { MemoryContext } from "@syner/sdk/context";
import { DefaultContextAgent } from "@syner/sdk/context";

import { InMemoryProvider } from "./providers";

export interface ContextAgentOptions {
  /**
   * LLM model to use
   * @default "openai/gpt-4o-mini"
   */
  model?: string;
  /**
   * Memory provider implementation
   * @default InMemoryProvider
   */
  memory?: MemoryContext;
}

/**
 * Create a context agent with Syner's opinionated defaults
 */
export function createContextAgent(options?: ContextAgentOptions) {
  const agent = new DefaultContextAgent({
    model: options?.model ?? "openai/gpt-4o-mini",
  });

  // Register memory API (use provided or default to InMemory)
  const memory = options?.memory ?? new InMemoryProvider();
  agent.registerAPI("memory", memory);

  // Add memory-specific guidelines
  agent.createGuideline({
    condition: "User asks to remember, save, store, or keep in mind",
    action: "Extract key information and store in memory with relevant tags",
    apis: ["memory"],
    priority: 100,
  });

  agent.createGuideline({
    condition: "User asks to recall, what did, do you remember, or what was",
    action: "Search memory for relevant information using keywords and tags",
    apis: ["memory"],
    priority: 95,
  });

  agent.createGuideline({
    condition: "User references past conversation or previous work",
    action: "Search memory with temporal and semantic filters",
    apis: ["memory"],
    priority: 90,
  });

  return agent;
}

// Export singleton with Syner defaults (InMemory)
export const context = createContextAgent();
