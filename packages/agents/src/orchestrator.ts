// In general usage, an orchestrator is defined as an entity that coordinates and manages complex workflows across multiple agents.
// This "coordination" involves planning, delegating, and monitoring tasks to achieve specific outcomes.
// Example: The orchestrator decomposes a request into tasks, assigns them to the appropriate workers, and coordinates dependencies.
// Here, the "orchestrator" depends on planning/orchestration capabilities, the organizational structure (departments and workers),
// and the system policies that govern how work is planned, assigned, and reported.

import { Experimental_Agent as Agent } from "ai";
import { getOrchestratorTools, type OrchestratorTools } from "@/tools";
import type { Plan } from "./plan";

// Combinar todos los tools de las capabilities del orchestrator
const tools = getOrchestratorTools();
const systemPrompt = `You are an orchestrator agent that coordinates and manages other agents.
You can use the other agents to help you with your tasks.`

export class Orchestrator extends Agent<OrchestratorTools> {
  constructor({ system }: { system?: string }) {
    super({
      model: "openai/gpt-4o",
      tools,
      system: system ?? systemPrompt,
    });

    return this;
  }

  async plan(plan: Plan): Promise<string> {
    const response = await this.generate({
      prompt: `Execute this plan by decomposing it into tasks and delegating to appropriate workers: ${JSON.stringify(plan)}`,
    })
    return response.text
  }
}
