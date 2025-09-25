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
      }),
    }),
    
    cancelExecution: tool({
      description: "Cancel a running plan execution",
      inputSchema: z.object({
        executionId: z.string(),
        reason: z.string().optional(),
      }),
    }),
  },
};
