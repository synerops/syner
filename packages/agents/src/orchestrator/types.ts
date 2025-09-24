import type { OrchestratorTools } from "../../tools";
import type { Plan } from "../plan/types";

export type OrchestratorConfig = {
  system?: string;
};

export type OrchestratorConstructor = new (config: OrchestratorConfig) => any; // Will be properly typed when Orchestrator class is imported

// Re-export the OrchestratorTools type for convenience
export type { OrchestratorTools };
