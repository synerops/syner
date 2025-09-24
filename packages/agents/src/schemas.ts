import { z } from "zod";
import type { Tool } from "ai";
import { TaskSchema } from "./task";

export interface ToolDefinition {
  name: string;
  description: string;
  tools: Record<string, Tool>;
  inputSchema: z.ZodSchema;
  outputSchema: z.ZodSchema;
  dependencies?: string[];
}

export interface ToolRegistry {
  orchestrator: ToolDefinition[];
  worker: ToolDefinition[];
  shared: ToolDefinition[];
}

export const CommonSchemas = {
  RequestSchema: z.object({
    id: z.string(),
    content: z.string(),
    context: z.record(z.any()).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  }),
  
  TaskSchema,
  
  ResponseSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
} as const;
