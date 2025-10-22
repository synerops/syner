// @ts-nocheck - AI SDK tool typing has issues with tsup DTS build
import { tool } from "ai";
import { z } from "zod";
import type { MemoryContext } from "@syner/sdk/context";

/**
 * Create AI SDK tools for Memory API
 * These tools allow the LLM to interact with memory autonomously
 */
export function createMemoryTools(memory: MemoryContext) {
  const memorySetSchema = z.object({
    key: z.string().describe("Unique key to identify this memory"),
    value: z.any().describe("The information to store"),
    tags: z.array(z.string()).optional().describe("Tags to categorize"),
  });

  const memoryGetSchema = z.object({
    key: z.string().describe("The key of the memory to retrieve"),
  });

  const memorySearchSchema = z.object({
    query: z.string().optional().describe("Text to search for"),
    tags: z.array(z.string()).optional().describe("Filter by tags"),
    limit: z.number().optional().default(10).describe("Max results"),
  });

  const memory_set = tool({
    description: "Store information in memory",
    parameters: memorySetSchema,
    execute: async (params) => {
      const result = await memory.set(params.key, params.value, {
        tags: params.tags,
      });
      return {
        success: true,
        id: result.id,
        key: result.key,
      };
    },
  });

  const memory_get = tool({
    description: "Retrieve a memory by key",
    parameters: memoryGetSchema,
    execute: async (params) => {
      const result = await memory.get(params.key);
      return result
        ? { found: true, key: result.key, value: result.value }
        : { found: false, key: params.key };
    },
  });

  const memory_search = tool({
    description: "Search memories",
    parameters: memorySearchSchema,
    execute: async (params) => {
      const results = await memory.search({
        query: params.query,
        tags: params.tags,
        limit: params.limit,
      });
      return {
        count: results.length,
        memories: results.map((m) => ({
          key: m.key,
          value: m.value,
        })),
      };
    },
  });

  return {
    memory_set,
    memory_get,
    memory_search,
  };
}
