import { Experimental_Agent as Agent } from "ai"
import type { 
  Prompt, 
  ToolSet, 
  Experimental_AgentSettings as AgentSettings, 
  GenerateTextResult 
} from "ai"

import type { Context } from "../context";
import { Reasoning } from "../context";

// Orchestrator Agent
export type OrchestratorTools = ToolSet

export interface OrchestratorOutput {
  result: string
}

export type OrchestratorOptions = AgentSettings<
  OrchestratorTools,
  OrchestratorOutput
>;

export class Orchestrator extends Agent<
  OrchestratorTools,
  OrchestratorOutput
> {
  async generate(options: Prompt): Promise<GenerateTextResult<OrchestratorTools, OrchestratorOutput>> {
    return this.run(options)
  }

  protected async run(options: Prompt): Promise<GenerateTextResult<OrchestratorTools, OrchestratorOutput>> {
    const context = this.context()

    if (! context.reasoning.requiresPlanning) {
      console.log("No planning required")
      // return this.execute(context)
    }

    // const plan = await this.plan(context)

    // if (!plan.isApproved()) {
    //   return this.askForApproval(plan)
    // }

    // const result = await this.execute(plan)

    // if (!result.isVerified()) {
    //   return this.verify(result)
    // }

    // return result
    return super.generate(options)
  }

  private context(): Context {
    return {
      reasoning: Reasoning.createReasoning(),
    } satisfies Context
  }
}