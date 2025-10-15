import type { Orchestrator } from "../agents/orchestrator"
import type { Planner, Plan } from "../agents/planner"
import type { Worker } from "../agents/worker"
import type { Prompt } from "ai"
import { approval, type ApprovalConfig } from "./approval"

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
  approvalConfig?: ApprovalConfig
}

/**
 * Run the agent loop: plan → execute → observe → repeat
 * 
 * This implements the iterative agent loop following Anthropic's agentic patterns:
 * 1. Gather context (side-effect free)
 * 2. Plan actions based on observations (what to do)
 * 3. Execute actions step by step using Worker agent (side effects)
 * 4. Handle tool approvals (human-in-the-loop)
 * 5. Observe results after each action
 * 6. Check completion and repeat
 * 
 * @param planner - The planner generating the plan
 * @param worker - The worker agent executing plan steps
 * @param config - Loop configuration including approval settings
 * @param initialPrompt - Initial task prompt
 * @returns Final loop state
 */
export async function runAgentLoop(
  planner: Planner,
  worker: Worker,
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

    // Phase 3: Execution (Worker executes each step)
    if (state.plan) {
      const pendingSteps = state.plan.steps.filter(s => !s.isComplete)
      
      for (const step of pendingSteps) {
        console.log(`Executing step: ${step.id}`)
        
        // Worker executes the step
        const result = await worker.execute(step)
        
        // Handle tool approvals if needed
        if (result.toolCalls) {
          const toolsNeedingApproval = result.toolCalls.filter(tc => tc.needsApproval)
          
          for (const toolCall of toolsNeedingApproval) {
            console.log(`Tool ${toolCall.name} requires approval`)
            
            // Wait for approval (this pauses the loop)
            const decision = await approval.waitForApproval(
              toolCall.id,
              toolCall.name,
              toolCall.input,
              config.approvalConfig
            )
            
            if (decision === 'denied') {
              console.log(`Tool ${toolCall.name} was denied`)
              // Add observation about denied tool
              state.observations.push(
                `Tool ${toolCall.name} (${toolCall.id}) was denied by user`
              )
              // Don't mark step as complete
              result.success = false
              break
            } else {
              console.log(`Tool ${toolCall.name} was approved`)
              state.observations.push(
                `Tool ${toolCall.name} (${toolCall.id}) was approved and executed`
              )
            }
          }
        }
        
        // Mark step as complete only if successful
        if (result.success) {
          step.isComplete = true
          
          // Add execution result to observations
          if (result.output) {
            state.observations.push(
              `Step ${step.id} completed: ${JSON.stringify(result.output)}`
            )
          }
        } else {
          // Add error to observations
          state.observations.push(
            `Step ${step.id} failed: ${result.error ?? 'Unknown error'}`
          )
        }
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

