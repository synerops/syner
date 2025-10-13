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
  team?: Record<string, Agent<ToolSet, unknown>>
}

export interface OrchestratorContract {
  generate(
    options: Prompt & { 
      team?: Record<string, Agent<ToolSet, unknown>>
    }
  ): Promise<GenerateTextResult<OrchestratorTools, OrchestratorOutput>>

  getTeam(): string[]
}

export class Orchestrator extends Agent<
  OrchestratorTools,
  OrchestratorOutput
> implements OrchestratorContract {
  protected team: Record<string, Agent<ToolSet, unknown>> = {}

  constructor(_options: OrchestratorSettings) {
    super({} as OrchestratorSettings)
  }
  
  generate(
    _options: Prompt & { 
      team?: Record<string, Agent<ToolSet, unknown>>
    }
  ): Promise<GenerateTextResult<OrchestratorTools, OrchestratorOutput>> {
    return this.generate(_options)
  }

  getTeam(): string[] {
    return Object.keys(this.team)
  }
}