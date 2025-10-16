import type * as orchestrator from "./orchestrator";
import type * as planner from "./planner";

export interface Agents {
  orchestrator: orchestrator.Orchestrator;
  planner: planner.Planner;
}
export type {
  // orchestration capability
  OrchestratorTools,
  OrchestratorOutput,
  OrchestratorSettings,
  Orchestrator,

  // coordination capability
  CoordinationOutput,

  // classification capability
  ClassificationOutput,

  // summarization capability
  SummarizationOutput,
} from "./orchestrator";

export type {
  PlannerTools,
  PlannerOutput,
  PlannerSettings,
  Planner,
} from "./planner";
