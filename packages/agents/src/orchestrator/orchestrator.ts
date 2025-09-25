import { Experimental_Agent as Agent, type ToolSet } from "ai";
import { z } from "zod";

import { PlanExecutionSchema, PlanSchema, type Plan } from "@/src/plan";
import { orchestration, planning } from "@/capabilities/orchestrator";

const tools = {
  ...orchestration.tools,
  ...planning.tools,
} satisfies ToolSet;

const SYSTEM_PROMPT = `
You are an orchestrator agent that coordinates and manages other agents. 
You can analyze requests, create action plans, and delegate tasks to appropriate workers.
You are responsible for the entire process of planning, delegating, and monitoring tasks to achieve specific outcomes.
You use the following capabilities:
- Planning: Analyze requests and create structured action plans
- Orchestration: Delegate tasks to appropriate workers
- Monitoring: Track progress and coordinate dependencies
`;

export class Orchestrator extends Agent<ToolSet> {
  constructor(config: { system?: string }) {
    super({
      model: "openai/gpt-4o",
      tools,
      system: config.system ?? SYSTEM_PROMPT
    });
  }

  async plan(
    request: string,
  ): Promise<Plan> {
    throw new Error("Not implemented")
  }

  async coordinate(
    plan: z.infer<typeof PlanSchema>,
  ): Promise<z.infer<typeof PlanExecutionSchema>> {
    throw new Error("Not implemented")
  }

  async process(
    request: string,
  ): Promise<z.infer<typeof PlanExecutionSchema>> {
    throw new Error("Not implemented")
  }

  async monitor(
    executionId: string,
  ): Promise<void> {
    throw new Error("Not implemented")
  }

  async cancel(
    executionId: string,
    reason?: string,
  ): Promise<void> {
    throw new Error("Not implemented")
  }
}
