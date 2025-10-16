import type {
  Prompt,
  ToolSet,
  Experimental_Agent as Agent,
  Experimental_AgentSettings as AgentSettings,
} from "ai";

import type { Context } from "../context";
import type { PlannerOutput } from "./planner";

// # Orchestrator
export type OrchestratorTools = ToolSet;

export interface OrchestratorOutput {
  plan: Partial<PlannerOutput>;
  summary: string;
}

export type OrchestratorSettings = AgentSettings<
  OrchestratorTools,
  OrchestratorOutput
> & {
  team?:
    | Map<string, Agent<ToolSet, unknown>>
    | Record<string, Agent<ToolSet, unknown>>;
};

export interface Orchestrator
  extends Agent<OrchestratorTools, OrchestratorOutput> {
  agents: Map<string, Agent<ToolSet, unknown>>;

  classify(
    options: Prompt & {
      context: Context;
    },
  ): Promise<Partial<ClassificationOutput>>;

  coordinate(
    options: Prompt & {
      context: Context;
    },
  ): Promise<Partial<CoordinationOutput>>;

  summarize(
    options: Prompt & {
      context: Context;
    },
  ): Promise<Partial<SummarizationOutput>>;

  orchestrate(
    options: Prompt & {
      context?: Partial<Context>;
    },
  ): Promise<Partial<OrchestratorOutput>>;
}

// ## Coordinator
export interface CoordinationOutput {
  plan: PlannerOutput;
  summary?: string;
  metadata?: Record<string, unknown>;
}

// ## Classifier
export interface ClassificationOutput {
  agent: string | undefined;
  prompt: Prompt;
  context: Context;
  isSimple: () => boolean;
}

// ## Summarizer
export interface SummarizationOutput {
  summary: string;
}
