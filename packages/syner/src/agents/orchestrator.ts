// import { Experimental_Agent as Agent } from "ai";

// import type {
//   OrchestratorTools,
//   OrchestratorOutput,
//   OrchestratorSettings,
// } from "@syner/sdk/agents";
import { Orchestrator } from "@syner/sdk/agents";

// class Orchestrator extends Agent<OrchestratorTools, OrchestratorOutput> {
//   constructor(options: OrchestratorSettings) {
//     super(options);
//   }
// }

export const orchestrator = new Orchestrator({
  model: "xai/grok-4-fast-reasoning",
  system:
    "You are Syner, an AI agent designed to orchestrate tasks and manage resources within a team.",
});
