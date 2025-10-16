import {
  OrchestratorTools,
  type Orchestrator,
  type OrchestratorOutput,
} from "@syner/sdk/agents";
import { BasicAgent, type ToolSet } from "ai";

export const createOrchestrator = (): Orchestrator => ({
  agents: {
    researcher: new BasicAgent({
      name: "Orchestrator",
      description: "Orchestrates the execution of agents",
      tools: OrchestratorTools,
    }),
  },
});
