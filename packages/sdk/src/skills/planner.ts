import type {
  Experimental_AgentSettings as AgentSettings,
  Prompt,
  ToolSet,
} from "ai"
import { Experimental_Agent as Agent } from "ai"

import type { Context } from "../context"

// # Planner
export type PlannerTools = ToolSet

export interface PlannerOutput {
  steps: PlanStep[]
  shouldSummarize: () => boolean
}

export type PlannerSettings = AgentSettings<PlannerTools, PlannerOutput>

export interface Planner extends Agent<PlannerTools, PlannerOutput> {
  plan(
    options: Prompt & {
      context: Context
    }
  ): ReturnType<Agent<PlannerTools, PlannerOutput>["generate"]>
}

// ## Step
export interface PlanStep {
  id: string
  prompt: Prompt
  context: Context
  agent: Agent<ToolSet, unknown>
}

export class DefaultPlanner
  extends Agent<PlannerTools, PlannerOutput>
  implements Planner
{
  constructor(settings: PlannerSettings) {
    super(settings)
  }

  plan(
    options: Prompt & {
      context: Context
    }
  ) {
    return this.generate(options)
  }
}
