import { 
  Experimental_Agent as Agent,
} from "ai"
import type { 
  Prompt, 
  ToolSet, 
  Experimental_AgentSettings as AgentSettings, 
  GenerateTextResult
} from "ai"

export type OrchestratorTools = ToolSet

export interface OrchestratorOutput {
  result: string
}

export type OrchestratorSettings = AgentSettings<
  OrchestratorTools,
  OrchestratorOutput
> & {
  team?: Map<string, Agent<ToolSet, unknown>> | Record<string, Agent<ToolSet, unknown>>
}

export interface OrchestratorContract {
  generate(
    options: Prompt & { 
      team?: Map<string, Agent<ToolSet, unknown>> | Record<string, Agent<ToolSet, unknown>>
    }
  ): Promise<GenerateTextResult<OrchestratorTools, OrchestratorOutput>>

  getTeam(): string[]
  addAgent(name: string, agent: Agent<ToolSet, unknown>): void
  removeAgent(name: string): boolean
  hasAgent(name: string): boolean
  getAgent(name: string): Agent<ToolSet, unknown> | undefined
}

export class Orchestrator extends Agent<
  OrchestratorTools,
  OrchestratorOutput
> implements OrchestratorContract {
  private _team = new Map<string, Agent<ToolSet, unknown>>()

  constructor(options: OrchestratorSettings) {
    super(options as AgentSettings<OrchestratorTools, OrchestratorOutput>)
    if (options.team) {
      this.team = options.team
    }
  }
  
  set team(value: Map<string, Agent<ToolSet, unknown>> | Record<string, Agent<ToolSet, unknown>>) {
    if (value instanceof Map) {
      this._team = value
    } else {
      this._team = new Map(Object.entries(value))
    }
  }

  get team(): Map<string, Agent<ToolSet, unknown>> {
    return this._team
  }
  
  generate(
    options: Prompt & { 
      team?: Map<string, Agent<ToolSet, unknown>> | Record<string, Agent<ToolSet, unknown>>
    }
  ): Promise<GenerateTextResult<OrchestratorTools, OrchestratorOutput>> {
    if (options.team) {
      this.team = options.team
    }
    return super.generate(options)
  }

  getTeam(): string[] {
    return Array.from(this._team.keys())
  }

  addAgent(name: string, agent: Agent<ToolSet, unknown>): void {
    this._team.set(name, agent)
  }

  removeAgent(name: string): boolean {
    return this._team.delete(name)
  }

  hasAgent(name: string): boolean {
    return this._team.has(name)
  }

  getAgent(name: string): Agent<ToolSet, unknown> | undefined {
    return this._team.get(name)
  }
}