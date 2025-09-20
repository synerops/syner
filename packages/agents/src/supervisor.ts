// In general usage, a supervisor is defined as an entity that coordinates and oversees work across others.
// This "oversight" is not limited to people; it can manage agents, workflows, and policies to align outcomes.
// Example: The supervisor decomposes a request into tasks, assigns them to the appropriate heads, and enforces traceability.
// Here, the "supervisor" depends on planning/delegation/audit capabilities, the organizational structure (departments and heads),
// and the system policies that govern how work is planned, assigned, and reported.

import { Experimental_Agent as Agent } from "ai";
import { getSupervisorTools } from "@/tools";

// Combinar todos los tools de las capabilities del supervisor
const tools = getSupervisorTools();
const systemPrompt = `You are a supervisor agent that manages the other agents.
You can use the other agents to help you with your tasks.`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Supervisor extends Agent<any, any, any> {
  constructor({ system }: { system?: string }) {
    super({
      model: "openai/gpt-4o",
      tools,
      system: system ?? systemPrompt,
    });

    return this;
  }

  async plan(message: string): Promise<string> {
    const response = await this.generate({
      prompt: message,
    })
    return response.text
  }
}
