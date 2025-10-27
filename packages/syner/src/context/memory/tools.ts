import type { MemoryContext } from "@syner/sdk/context"
import type { ToolSet } from "ai"
import { tool } from "ai"
import { z } from "zod/v4"

/**
 * Create AI SDK tools for Memory API
 * These tools allow the LLM to interact with memory autonomously
 *
 * @see https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling
 */
export function createMemoryTools(memory: MemoryContext): ToolSet {
  return {
    memory_remember: tool({
      description:
        "Store information in memory for later retrieval. " +
        "Returns a success confirmation with the memory ID and key. " +
        "Use this when the user asks to remember, save, or store information.",
      inputSchema: z.object({
        key: z.string().describe(
          "Unique identifier for this memory (e.g., 'user_preference', 'project_context'). " +
            "Use descriptive keys that indicate what is being stored.",
        ),
        value: z.unknown().describe(
          "The information to store. Can be any JSON-serializable value " +
            "(string, number, object, array, etc.).",
        ),
        tags: z
          .array(z.string())
          .nullable()
          .describe(
            "Optional tags to categorize and filter memories " +
              "(e.g., ['project', 'user-settings']). Set to null if not needed.",
          ),
      }),
      execute: async (params) => {
        const result = await memory.set(params.key, params.value, {
          tags: params.tags ?? undefined,
        })

        return {
          success: true,
          message: `Memory stored successfully with key: ${result.key}`,
          id: result.id,
          key: result.key,
        }
      },
    }),

    memory_recall: tool({
      description:
        "Retrieve a memory by its unique key. " +
        "Returns the stored value if found, or indicates if the memory doesn't exist. " +
        "Use this when you need to recall a specific piece of information.",
      inputSchema: z.object({
        key: z.string().describe(
          "The unique key of the memory to retrieve " +
            "(e.g., 'user_preference', 'project_context').",
        ),
      }),
      execute: async (params) => {
        const result = await memory.get(params.key)

        if (!result) {
          return {
            found: false,
            message: `No memory found with key: ${params.key}`,
            key: params.key,
          }
        }

        return {
          found: true,
          message: `Memory retrieved successfully`,
          key: result.key,
          value: result.value,
          tags: result.metadata?.tags ?? [],
        }
      },
    }),

    memory_recall_by_tags: tool({
      description:
        "Search for memories using text queries and/or tags. " +
        "Returns a list of matching memories with their keys and values. " +
        "Use this when you need to find related information or filter by categories.",
      inputSchema: z.object({
        query: z
          .string()
          .nullable()
          .describe(
            "Text to search for in memory keys and values. " +
              "Set to null to search by tags only.",
          ),
        tags: z
          .array(z.string())
          .nullable()
          .describe(
            "Filter memories by these tags (e.g., ['project', 'settings']). " +
              "Set to null to search by query only.",
          ),
        limit: z
          .number()
          .int()
          .positive()
          .default(10)
          .describe("Maximum number of results to return (default: 10)."),
      }),
      execute: async (params) => {
        const results = await memory.search({
          query: params.query ?? undefined,
          tags: params.tags ?? undefined,
          limit: params.limit,
        })

        return {
          found: results.length > 0,
          count: results.length,
          message: `Found ${results.length} matching ${results.length === 1 ? "memory" : "memories"}`,
          memories: results.map((m) => ({
            key: m.key,
            value: m.value,
            tags: m.metadata?.tags ?? [],
          })),
        }
      },
    }),
  }
}
