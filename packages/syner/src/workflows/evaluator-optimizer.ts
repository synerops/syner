import type { Agent, Workflow } from '@syner/sdk'

export interface EvaluatorOptimizerAgents {
  generator: Agent
  evaluator: Agent
}

export interface EvaluatorOptimizerConfig {
  maxIterations?: number
  convergenceCriteria?: (current: unknown, previous: unknown) => boolean
}

export class EvaluatorOptimizerWorkflow<T> implements Workflow<T, EvaluatorOptimizerConfig> {
  constructor(
    private agents: EvaluatorOptimizerAgents,
    public config?: EvaluatorOptimizerConfig
  ) {}

  async execute(input: unknown): Promise<T> {
    throw new Error('EvaluatorOptimizer workflow not implemented yet')
  }
}
