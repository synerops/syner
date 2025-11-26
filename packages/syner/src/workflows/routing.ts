import type { Agent, Workflow } from '@syner/sdk'

export interface RoutingAgents {
  router: Agent
}

export interface RoutingConfig {
  routes: Record<string, Agent>
  defaultRoute?: Agent
}

export class RoutingWorkflow<T> implements Workflow<T, RoutingConfig> {
  constructor(
    private agents: RoutingAgents,
    public config: RoutingConfig
  ) {}

  async execute(input: unknown): Promise<T> {
    throw new Error('Routing workflow not implemented yet')
  }
}
