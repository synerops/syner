import { 
  Experimental_Agent as Agent
} from "ai"
import type { 
  Prompt, 
  ToolSet, 
  Experimental_AgentSettings as AgentSettings, 
  GenerateTextResult
} from "ai"

import type { Context, ReasoningStrategy } from "../context"
import { Reasoning } from "../context"
import { Planner } from "./planner"
import { Executor } from "./executor"
import type { Plan, PlanStep } from "./planner"
import type { ExecutionResult } from "./executor"

// Orchestrator Agent
export type OrchestratorTools = ToolSet

export interface OrchestratorOutput {
  result: string
  plan?: Plan
  executions?: ExecutionResult[]
  iterations?: number
}

export type OrchestratorSettings = AgentSettings<
  OrchestratorTools,
  OrchestratorOutput
> & {
  team?: Record<string, Agent<ToolSet, unknown>>
  strategy?: ReasoningStrategy
  planner?: Planner
  executor?: Executor
}

export class Orchestrator extends Agent<
  OrchestratorTools,
  OrchestratorOutput
> {
  protected team: Record<
    string, 
    Agent<ToolSet, unknown>
  > = {}
  protected strategy: ReasoningStrategy
  protected planner: Planner
  protected executor: Executor

  constructor(options: OrchestratorSettings) {
    super(options)
    this.team = options.team ?? {}
    
    // Initialize reasoning strategy
    this.strategy = options.strategy ?? Reasoning.auto().getStrategy()
    
    // Initialize planner and executor with the strategy
    this.planner = options.planner ?? new Planner({
      model: options.model,
      strategy: this.strategy,
    })
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.executor = options.executor ?? new Executor({
      model: options.model,
      strategy: this.strategy,
    })
  }
  
  async generate(
    options: Prompt & { 
      team?: Record<string, Agent<ToolSet, unknown>>
      strategy?: ReasoningStrategy
    })
    : Promise<
      GenerateTextResult<OrchestratorTools, OrchestratorOutput>
    > {
    // Allow strategy override at runtime
    if (options.strategy) {
      this.strategy = options.strategy
    }
    
    return this.run(options)
  }

  protected async run(
    options: Prompt & { team?: Record<string, Agent<ToolSet, unknown>> }
  ): Promise<GenerateTextResult<OrchestratorTools, OrchestratorOutput>> {
    const reasoning = new Reasoning(this.strategy)

    // Determine which execution mode to use
    if (reasoning.isReActMode()) {
      return this.runReAct(options, reasoning)
    }

    if (reasoning.isReWOOMode()) {
      return this.runReWOO(options, reasoning)
    }

    if (reasoning.isAutoMode()) {
      return this.runAuto(options, reasoning)
    }

    // Fallback to direct generation
    return super.generate(options)
  }

  /**
   * Run in ReAct mode: iterative planning and execution with observations
   */
  private async runReAct(
    options: Prompt,
    reasoning: Reasoning
  ): Promise<GenerateTextResult<OrchestratorTools, OrchestratorOutput>> {
    const maxIterations = reasoning.getMaxIterations()
    const observations: string[] = []
    const completedSteps: PlanStep[] = []
    
    let iteration = 0
    let isComplete = false

    const basePrompt = typeof options.prompt === 'string' ? options.prompt : ''

    while (iteration < maxIterations && !isComplete) {
      iteration++

      // Step 1: Plan next action based on observations
      await this.planner.plan({
        prompt: basePrompt,
        observations,
        previousSteps: completedSteps,
      })

      // For now, create a simple step
      // In a real implementation, this would use the plan from the planner
      const mockStep: PlanStep = {
        id: `step-${iteration}`,
        description: `Execute step ${iteration}`,
        action: basePrompt,
        dependencies: [],
        expectedOutcome: "Success"
      }

      // Step 2: Execute the next step
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.executor.executeStep(mockStep, options)

      // Step 3: Observe and track (simplified for now)
      observations.push(`Step ${iteration} executed`)
      completedSteps.push(mockStep)

      // For now, complete after first iteration
      // In a real implementation, check execution results
      isComplete = iteration >= 1
    }

    // Return using the base generator
    // In a real implementation, this would incorporate the execution results
    return super.generate(options)
  }

  /**
   * Run in ReWOO mode: plan all steps upfront, execute in batch
   */
  private async runReWOO(
    options: Prompt,
    _reasoning: Reasoning
  ): Promise<GenerateTextResult<OrchestratorTools, OrchestratorOutput>> {
    const basePrompt = typeof options.prompt === 'string' ? options.prompt : ''

    // Step 1: Plan everything upfront
    await this.planner.plan({
      prompt: basePrompt,
    })

    // For now, create a simple plan
    // In a real implementation, this would use the plan from the planner
    const mockPlan: Plan = {
      steps: [{
        id: 'batch-step-1',
        description: 'Execute batch operation',
        action: basePrompt,
        dependencies: [],
        expectedOutcome: 'Success'
      }],
      strategy: this.strategy,
      isComplete: false
    }

    // Step 2: Execute all steps in batch
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.executor.execute(mockPlan, options)

    // Return using the base generator for now
    // In a real implementation, this would properly transform the executor result
    return super.generate(options)
  }

  /**
   * Run in Auto mode: decide strategy based on task complexity
   */
  private async runAuto(
    options: Prompt,
    reasoning: Reasoning
  ): Promise<GenerateTextResult<OrchestratorTools, OrchestratorOutput>> {
    // Analyze task complexity (simple heuristic for now)
    const basePrompt = typeof options.prompt === 'string' ? options.prompt : ''
    const promptLength = basePrompt.length
    const isComplexTask = promptLength > 500 || 
                          basePrompt.includes("multiple") ||
                          basePrompt.includes("all") ||
                          basePrompt.includes("batch")

    // Choose strategy based on analysis
    if (isComplexTask) {
      // Complex tasks benefit from upfront planning (ReWOO)
      reasoning.setStrategy({ mode: "rewoo", planUpfront: true, executeInBatch: true })
      return this.runReWOO(options, reasoning)
    } else {
      // Simple/exploratory tasks benefit from iteration (ReAct)
      reasoning.setStrategy({ mode: "react", observeAfterEachAction: true })
      return this.runReAct(options, reasoning)
    }
  }

  private context(): Context {
    return {
      reasoning: new Reasoning(this.strategy),
    } satisfies Context
  }

  /**
   * Get the current strategy
   */
  getStrategy(): ReasoningStrategy {
    return { ...this.strategy }
  }

  /**
   * Set a new strategy
   */
  setStrategy(strategy: ReasoningStrategy): void {
    this.strategy = strategy
    // Note: Planner and executor need to be recreated with new strategy
    // In a real implementation, store the model reference or allow strategy updates
    // without recreating the agents
  }
}