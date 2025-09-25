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
        metadata: z.record(z.any()).optional(),
      }),
    }),
  },
};
