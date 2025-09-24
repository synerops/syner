import type { Tool } from "ai";
import { planningCapability } from "./supervisor/planning";
import { orchestrationCapability } from "./supervisor/orchestration";
import { taskExecutionCapability } from "./worker/task-execution";

// Define tool types for type safety
export type OrchestratorTools = Record<string, Tool>;
export type WorkerTools = Record<string, Tool>;

/**
 * Get all tools available for orchestrator agents
 * Includes planning and orchestration capabilities
 */
export function getOrchestratorTools(): Record<string, Tool> {
  return {
    ...planningCapability.tools,
    ...orchestrationCapability.tools,
  };
}

/**
 * Get all tools available for worker agents
 * Includes task execution capabilities
 */
export function getWorkerTools(): Record<string, Tool> {
  return {
    ...taskExecutionCapability.tools,
  };
}

/**
 * Get shared tools available for all agents
 * Currently empty but can be extended
 */
export function getSharedTools(): Record<string, Tool> {
  return {};
}

// Registry of all tools
export const registry: Record<string, Tool[]> = {
  orchestrator: Object.values(getOrchestratorTools()),
  worker: Object.values(getWorkerTools()),
  shared: Object.values(getSharedTools()),
};
