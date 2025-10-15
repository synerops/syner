import type { Orchestrator } from "../agents/orchestrator"
import type { Planner, Plan } from "../agents/planner"
import type { Prompt } from "ai"

/**
 * State of the agent loop at any given iteration
 */
export interface LoopState {
  iteration: number
  isComplete: boolean
  plan?: Plan
  context?: unknown
  observations: string[]
}

/**
 * Configuration for the agent loop
 */
export interface LoopConfig {
  maxIterations: number
  stopCondition: (state: LoopState) => boolean
  onIteration?: (state: LoopState) => void | Promise<void>
}

/**
 * Run the agent loop: plan → execute → observe → repeat
 * 
 * This implements a basic iterative agent loop:
 * 1. Gather context (side-effect free)
 * 2. Plan actions based on observations (what to do)
 * 3. Execute actions step by step (side effects)
 * 4. Observe results after each action
 * 5. Check completion and repeat
 * 
 * @param orchestrator - The orchestrator coordinating the loop
 * @param planner - The planner generating the plan
 * @param executor - The executor carrying out the plan
 * @param config - Loop configuration
 * @param initialPrompt - Initial task prompt
 * @returns Final loop state
 */
export async function runAgentLoop(
  planner: Planner,
  config: LoopConfig,
  initialPrompt: Prompt
): Promise<LoopState> {
  const state: LoopState = {
    iteration: 0,
    isComplete: false,
    observations: [],
  }

  while (!state.isComplete && state.iteration < config.maxIterations) {
    // Phase 1: Context gathering (side-effect free)
    // TODO: Integrate with context/ APIs
    
    // Phase 2: Planning (using observations from previous iterations)
    const planResult = await planner.plan({
      ...initialPrompt,
      observations: state.observations,
      previousSteps: state.plan?.steps,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    state.plan = (planResult as any).output.plan as Plan

    // Phase 3: Execution (step by step with observations)
    if (state.plan) {
      const pendingSteps = state.plan.steps.filter(s => !s.isComplete)
      
      for (const step of pendingSteps) {
        console.log(`Executing step: ${step.id}`)
        
        // Mark step as complete
        step.isComplete = true
      }
    }

    // Phase 4: Checks (validation)
    // TODO: Integrate with checks/ APIs
    
    // Evaluate stop condition
    state.isComplete = config.stopCondition(state)
    state.iteration++
    
    // Call iteration callback
    if (config.onIteration) {
      await config.onIteration(state)
    }
  }

  return state
}

