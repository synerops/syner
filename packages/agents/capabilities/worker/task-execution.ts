import { z } from "zod";
import { tool } from "ai";
import type { Capability } from "@/src/capability";
import { TaskSchema } from "@/src/task";

/**
 * CORE CAPABILITY for workers
 * Executes specific tasks assigned by orchestrators with domain expertise
 * Dependencies: none (receives tasks from orchestrators)
 * Dependents: reporting
 */
export const capability: Capability = {
  name: "task_execution",
  description: "Execute specific tasks with domain expertise and tools",
  roles: ["worker"],
  metadata: {
    tags: ["execution", "domain", "tools"],
  },
  tools: {
    executeTask: tool({
      description: "Execute a specific task using domain-specific tools and knowledge",
      inputSchema: z.object({
        task: TaskSchema,
        executionContext: z.object({
          environment: z.enum(["development", "staging", "production"]).default("development"),
          resourceLimits: z.record(z.number()).optional(),
          timeout: z.number().optional(), // seconds
        }),
      }),
    }),
    
    validateInput: tool({
      description: "Validate task input parameters before execution",
      inputSchema: z.object({
        task: TaskSchema,
        validationRules: z.array(z.object({
          field: z.string(),
          type: z.enum(["required", "format", "range", "custom"]),
          value: z.any().optional(),
        })),
      }),
    }),
    
    handleExecutionError: tool({
      description: "Handle and recover from execution errors",
      inputSchema: z.object({
        error: z.object({
          type: z.string(),
          message: z.string(),
          stack: z.string().optional(),
          context: z.record(z.any()),
        }),
        task: TaskSchema,
        retryAttempt: z.number().default(0),
      }),
    }),
  },
};
