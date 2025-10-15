import { 
  Experimental_Agent as Agent,
} from "ai"
import type { 
  Prompt, 
  ToolSet, 
  Experimental_AgentSettings as AgentSettings, 
} from "ai"
import type { Planner } from "./planner"
import type { LoopState } from "../runtime/loop"
import { runAgentLoop } from "../runtime/loop"

export type OrchestratorTools = ToolSet

export interface OrchestratorOutput {
  result: string
}

export type OrchestratorSettings = AgentSettings<
  OrchestratorTools,
  OrchestratorOutput
> & {
  team?: Map<string, Agent<ToolSet, unknown>> | Record<string, Agent<ToolSet, unknown>>
  maxIterations?: number
  stopCondition?: (state: LoopState) => boolean
  onIteration?: (state: LoopState) => void | Promise<void>
}

export interface OrchestratorContract {
  getTeam(): string[]
  addAgent(name: string, agent: Agent<ToolSet, unknown>): void
  removeAgent(name: string): boolean
  hasAgent(name: string): boolean
  getAgent(name: string): Agent<ToolSet, unknown> | undefined
  
  addPlanner(planner: Planner): void
  getPlanner(): Planner | undefined
  
  run(options: {
    prompt: string | Prompt
    maxIterations?: number
    planner?: Planner
    stopCondition?: (state: LoopState) => boolean
    onIteration?: (state: LoopState) => void | Promise<void>
  }): Promise<LoopState>
}

export class Orchestrator extends Agent<
  OrchestratorTools,
  OrchestratorOutput
> implements OrchestratorContract {
  private _team = new Map<string, Agent<ToolSet, unknown>>()
  private _planner?: Planner

  constructor(options: OrchestratorSettings) {
    super(options as AgentSettings<OrchestratorTools, OrchestratorOutput>)
    if (options.team) {
      this.team = options.team
    }
  }
  
  set team(value: Map<string, Agent<ToolSet, unknown>> | Record<
    string, Agent<ToolSet, unknown>
  >) {
    if (value instanceof Map) {
      this._team = value
    } else {
      this._team = new Map(Object.entries(value))
    }
  }

  get team(): Map<string, Agent<ToolSet, unknown>> {
    return this._team
  }
  
  async run(options: {
    prompt: Prompt
    maxIterations?: number
    planner?: Planner
    stopCondition?: (state: LoopState) => boolean
    onIteration?: (state: LoopState) => void | Promise<void>
  }): Promise<LoopState> {
    if (! this._team.has("planner")) {
      throw new Error("Planner is required. Add a planner using addPlanner() or provide one in options.")
    }

    return runAgentLoop(
      this._team.get("planner") as Planner,
      {
        maxIterations: options.maxIterations ?? 5,
        stopCondition: options.stopCondition ?? ((state) => state.plan?.isComplete ?? false),
        onIteration: options.onIteration,
      },
      options.prompt
    )
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

  addPlanner(planner: Planner): void {
    this._team.set("planner", planner)
  }

  getPlanner(): Planner | undefined {
    return this._team.get("planner") as Planner | undefined
  }
}
