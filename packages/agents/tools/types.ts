import { z } from "zod";
import type { Tool } from "ai";

// Base types para tools
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

// Schemas comunes
export const CommonSchemas = {
  RequestSchema: z.object({
    id: z.string(),
    content: z.string(),
    context: z.record(z.any()).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  }),
  
  TaskSchema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    capability: z.string(),
    parameters: z.record(z.any()),
    status: z.enum(["pending", "in_progress", "completed", "failed"]),
    assignedAgent: z.string().optional(),
  }),
  
  ResponseSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
} as const;
