import { Agent, InferAgentOutput } from "@/lib/agents";
import { Output } from "ai";
import { z } from "zod";

const departments = {
  // engineering: "engineering",
  // product: "product",
  // design: "design",
  marketing: "marketing",
  // sales: "sales",
};

const schema = z.object({
  needsRouting: z
    .boolean()
    .default(false)
    .describe(
      "Whether the request needs to be routed to a department supervisor",
    ),
  directResponse: z
    .string()
    .optional()
    .describe(
      "A direct response to the user if the request does not need to be routed to a department supervisor and can be answered directly",
    ),
  routes: z
    .array(
      z.object({
        supervisor: z
          .enum(Object.keys(departments) as [string, ...string[]])
          .describe("The supervisor of the department to route the request to"),
        reasonOfRouting: z
          .string()
          .describe("The reason for routing the request to the department"),
        taskToPlan: z
          .string()
          .describe("The task to be planned and executed by the department"),
      }),
    )
    .optional()
    .describe(
      "The route strategies to route the request to if it needs to be routed",
    ),
});

export const name = "router";

export const routerAgent = new Agent<{}, z.infer<typeof schema>>({
  name,
  model: "openai/gpt-4o",
  system:
    "You are a router agent that routes user requests to appropriate department supervisors",
  experimental_output: Output.object({ schema }),
});

// Export inferred type for use in API routes
export type AgentOutput = InferAgentOutput<typeof routerAgent>;
