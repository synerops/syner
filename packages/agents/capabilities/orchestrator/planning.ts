import { z } from "zod";
import { tool } from "ai";
import type { Capability } from "@/src/capability";
import { PlanSchema } from "@/src";

/**
 * CORE CAPABILITY for orchestrators
 * Must analyze requests and create structured plans before any orchestration
 * Dependencies: none (this runs first)
 * Dependents: orchestration, monitoring
 */
export const capability: Capability = {
  name: "planning",
  description: "Analyze requests and create structured action plans",
  roles: ["orchestrator"],
  metadata: {
    tags: ["orchestration", "analysis", "planning"],
  },
  tools: {
    analyzeRequest: tool({
      description: "Analyze incoming requests to understand requirements and context",
      inputSchema: z.object({
        request: z.string(),
        context: z.record(z.any()).optional(),
      }),
    }),
    createPlan: tool({
      name: "createPlan",
      description: "Create a structured action plan from analyzed requirements",
      inputSchema: z.object({
        request: z.string(),
        context: z.record(z.any()).optional(),
        preferences: z.record(z.any()).optional(),
      }),
      outputSchema: PlanSchema,
    }),
  },
};
