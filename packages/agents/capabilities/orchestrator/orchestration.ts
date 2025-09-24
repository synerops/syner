import { z } from "zod";
import { tool } from "ai";
import type { Capability } from "@/src/capability";
import { TaskSchema } from "@/src/task";

export const capability: Capability = {
  name: "orchestration",
  description: "Coordinate and delegate tasks across departments and agents",
  roles: ["orchestrator"],
  // tags: ["coordination", "delegation", "workflow"],
  tools: {
    delegateTask: tool({
      description: "Delegate a task to the appropriate agent or department",
      inputSchema: z.object({
        task: TaskSchema,
        agent: z.string(),
      }),
    }),
    
    coordinateWorkflow: tool({
      description: "Coordinate multi-step workflows across multiple agents",
      inputSchema: z.object({
        workflowId: z.string(),
        steps: z.array(TaskSchema),
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
  // input: RequestSchema,
  // output: z.object({
  //   delegationResults: z.array(z.object({
  //     taskId: z.string(),
  //     assignedAgent: z.string(),
  //     status: z.enum(["assigned", "failed"]),
  //     estimatedCompletion: z.string().optional(),
  //   })),
  //   coordinationPlan: z.object({
  //     workflowId: z.string(),
  //     totalSteps: z.number(),
  //     estimatedDuration: z.string(),
  //   }).optional(),
  // }),
};
