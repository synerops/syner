import { z } from "zod";
import { tool } from "ai";
import { CommonSchemas } from "../types";

/**
 * CORE CAPABILITY for supervisors
 * Must analyze requests and create structured plans before any orchestration
 * Dependencies: none (this runs first)
 * Dependents: orchestration, monitoring
 */
export const planningCapability = {
  name: "planning",
  description: "Analyze requests and create structured action plans",
  tools: {
    analyzeRequest: tool({
      description: "Analyze user request and extract intent, requirements, and constraints",
      inputSchema: z.object({
        request: z.string(),
        context: z.record(z.any()).optional(),
        userPreferences: z.record(z.any()).optional(),
      }),
    }),
    
    createActionPlan: tool({
      description: "Create a structured action plan from analyzed requirements",
      inputSchema: z.object({
        requirements: z.object({
          intent: z.string(),
          constraints: z.array(z.string()).optional(),
          preferences: z.record(z.any()).optional(),
        }),
        availableCapabilities: z.array(z.string()),
      }),
    }),
    
    optimizePlan: tool({
      description: "Optimize action plan based on available resources and constraints",
      inputSchema: z.object({
        plan: z.object({
          steps: z.array(CommonSchemas.TaskSchema),
          dependencies: z.array(z.object({
            from: z.string(),
            to: z.string(),
          })),
        }),
        constraints: z.object({
          maxDuration: z.string().optional(),
          resourceLimits: z.record(z.number()).optional(),
          priority: z.enum(["low", "medium", "high", "urgent"]),
        }),
      }),
    }),
  },
  inputSchema: CommonSchemas.RequestSchema,
  outputSchema: z.object({
    analysis: z.object({
      intent: z.string(),
      complexity: z.enum(["simple", "moderate", "complex"]),
      estimatedDuration: z.string(),
      requiredCapabilities: z.array(z.string()),
    }),
    actionPlan: z.object({
      id: z.string(),
      steps: z.array(CommonSchemas.TaskSchema),
      dependencies: z.array(z.object({
        from: z.string(),
        to: z.string(),
      })),
      estimatedCompletion: z.string(),
    }),
  }),
};
