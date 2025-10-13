import { Experimental_Agent as Agent } from "ai";

import type {
  OrchestratorTools,
  OrchestratorOutput,
  OrchestratorSettings,
} from "@syner/sdk/agents";

export class Orchestrator extends Agent<OrchestratorTools, OrchestratorOutput> {
  constructor(options: OrchestratorSettings) {
    super(options);
  }
}
