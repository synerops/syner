import type { Agent, Workflow } from '@syner/sdk'

export interface OrchestratorWorkerAgents {
  orchestrator: Agent
  worker: Agent
}

export interface OrchestratorWorkerConfig {
  maxWorkers?: number
  timeout?: number
}

export class OrchestratorWorkerWorkflow<T> implements Workflow<T, OrchestratorWorkerConfig> {
  constructor(
    private agents: OrchestratorWorkerAgents,
    public config?: OrchestratorWorkerConfig
  ) {}

  async execute(input: unknown): Promise<T> {
    throw new Error('OrchestratorWorker workflow not implemented yet')
  }
}
