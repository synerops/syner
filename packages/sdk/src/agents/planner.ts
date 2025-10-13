import { 
  Experimental_Agent as Agent, 
} from "ai"
import type {
  Experimental_AgentSettings as AgentSettings,
  ToolSet,
  GenerateTextResult,
  Prompt,
} from "ai"

/**
 * Represents a complete execution plan
 */
export interface Plan {
  steps: PlanStep[]
  isComplete: boolean
}

/**
 * Represents a single step in an execution plan
 */
export interface PlanStep {
  id: string
  description: string
  action: string
  dependencies: string[]
  expectedOutcome: string
  isComplete: boolean
}

/**
 * Output from the Planner agent
 */
export interface PlannerOutput {
  plan: Plan
}

export type PlannerTools = ToolSet

export type PlannerSettings = AgentSettings<PlannerTools, PlannerOutput>

export interface PlannerContract {
  plan(
    options: Prompt & {
      observations?: string[]
      previousSteps?: PlanStep[]
    },
  ): Promise<GenerateTextResult<PlannerTools, PlannerOutput>>

  isComplete(plan: Plan): boolean
}

export class Planner extends Agent<
  PlannerTools, 
  PlannerOutput
> implements PlannerContract {
  constructor(_options: PlannerSettings) {
    super({} as PlannerSettings)
  }

  plan(
    _options: Prompt & {
      observations?: string[]
      previousSteps?: PlanStep[]
    },
  ): Promise<GenerateTextResult<PlannerTools, PlannerOutput>> {
    return this.generate(_options)
  }

  isComplete(_plan: Plan): boolean {
    return _plan.isComplete
  }
}
