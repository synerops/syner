import { 
  Experimental_Agent as Agent, 
} from "ai"
import type {
  Experimental_AgentSettings as AgentSettings,
  ToolSet,
  GenerateTextResult,
  Prompt,
} from "ai"

export type PlannerTools = ToolSet

export interface PlannerOutput {
  plan: Plan
}

export type PlannerSettings = AgentSettings<
  PlannerTools, 
  PlannerOutput
> & {
  maxSteps?: number
}

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

export interface PlannerContract {
  plan(
    options: Prompt & {
      observations?: string[]
      previousSteps?: PlanStep[]
    },
  ): Promise<GenerateTextResult<PlannerTools, PlannerOutput>>

}

export class Planner extends Agent<
  PlannerTools, 
  PlannerOutput
> implements PlannerContract {
  constructor(options: PlannerSettings) {
    super(options)
  }

  plan(
    settings: Prompt & {
      observations?: string[]
      previousSteps?: PlanStep[]
    },
  ): Promise<GenerateTextResult<PlannerTools, PlannerOutput>> {
    return this.generate({
      prompt: settings.prompt,
    })
  }
}
