import type {
  Experimental_Agent as Agent,
  Experimental_AgentSettings as AgentSettings,
  ToolSet,
  Prompt,
} from "ai";

import type { Context } from "../context";

// # Planner
export type PlannerTools = ToolSet;

export interface PlannerOutput {
  steps: PlanStep[];
  shouldSummarize: () => boolean;
}

export type PlannerSettings = AgentSettings<PlannerTools, PlannerOutput>;

export interface Planner extends Agent<PlannerTools, PlannerOutput> {
  plan(
    options: Prompt & {
      context: Context;
    },
  ): Promise<Partial<PlannerOutput>>;
}

// ## Step
export interface PlanStep {
  id: string;
  prompt: Prompt;
  context: Context;
  agent: Agent<ToolSet, unknown>;
}
