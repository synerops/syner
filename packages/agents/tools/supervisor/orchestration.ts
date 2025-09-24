import { z } from "zod";
import { tool } from "ai";
import type { Capability } from "../../src/capability/types";
import { CommonSchemas } from "../../src/shared/schemas";

/**
 * SUPPORTING CAPABILITY for orchestrators
 * Executes plans created by planning capability - delegates and coordinates tasks
 * Dependencies: planning (needs a plan to orchestrate)
 * Dependents: monitoring
 */
export const orchestrationCapability: Capability = {
  name: "orchestration",
  description: "Coordinate and delegate tasks across departments and agents",
  tools: {
    delegateTask: tool({
      description: "Delegate a task to the appropriate agent or department",
      inputSchema: z.object({
        task: CommonSchemas.TaskSchema,
        targetAgent: z.string(),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
      }),
    }),
    
    coordinateWorkflow: tool({
      description: "Coordinate multi-step workflows across multiple agents",
      inputSchema: z.object({
        workflowId: z.string(),
        steps: z.array(CommonSchemas.TaskSchema),
        dependencies: z.array(z.object({
          from: z.string(),
          to: z.string(),
        })).optional(),
      }),
    }),
    
    monitorProgress: tool({
      description: "Monitor the progress of delegated tasks",
      inputSchema: z.object({
        taskIds: z.array(z.string()),
        includeMetrics: z.boolean().default(false),
      }),
    }),
  },
  input: CommonSchemas.RequestSchema,
  output: z.object({
    delegationResults: z.array(z.object({
      taskId: z.string(),
      assignedAgent: z.string(),
      status: z.enum(["assigned", "failed"]),
      estimatedCompletion: z.string().optional(),
    })),
    coordinationPlan: z.object({
      workflowId: z.string(),
      totalSteps: z.number(),
      estimatedDuration: z.string(),
    }).optional(),
  }),
};
