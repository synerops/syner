import { z } from "zod";
import { tool } from "ai";
import { CommonSchemas } from "../types";

/**
 * CORE CAPABILITY for workers
 * Executes specific tasks assigned by orchestrators with domain expertise
 * Dependencies: none (receives tasks from orchestrators)
 * Dependents: reporting
 */
export const taskExecutionCapability = {
  name: "task_execution",
  description: "Execute specific tasks with domain expertise and tools",
  tools: {
    executeTask: tool({
      description: "Execute a specific task using domain-specific tools and knowledge",
      inputSchema: z.object({
        task: CommonSchemas.TaskSchema,
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
        task: CommonSchemas.TaskSchema,
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
        task: CommonSchemas.TaskSchema,
        retryAttempt: z.number().default(0),
      }),
    }),
    
    optimizeExecution: tool({
      description: "Optimize task execution based on available resources",
      inputSchema: z.object({
        task: CommonSchemas.TaskSchema,
        availableResources: z.object({
          cpu: z.number(),
          memory: z.number(),
          network: z.number(),
          storage: z.number(),
        }),
        optimizationGoals: z.array(z.enum(["speed", "resource_efficiency", "accuracy"])),
      }),
    }),
  },
  inputSchema: CommonSchemas.TaskSchema,
  outputSchema: z.object({
    executionResult: z.object({
      success: z.boolean(),
      output: z.any().optional(),
      metrics: z.object({
        executionTime: z.number(), // milliseconds
        resourceUsage: z.object({
          cpu: z.number(),
          memory: z.number(),
          network: z.number(),
        }),
        quality: z.number().optional(), // 0-1 score
      }),
      logs: z.array(z.object({
        level: z.enum(["debug", "info", "warn", "error"]),
        message: z.string(),
        timestamp: z.string(),
      })),
    }),
    nextSteps: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional(),
  }),
};
