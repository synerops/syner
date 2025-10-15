import { Orchestrator } from "@syner/sdk/agents";
import type { OrchestratorSettings } from "@syner/sdk/agents";
import { createPlanner } from "./planner";
import { createWorker } from "./worker";

/**
 * Create an Orchestrator with Syner OS defaults
 *
 * Automatically injects default Planner and Worker instances,
 * enabling the orchestrator.run() method out of the box.
 *
 * @param overrides - Optional settings to override defaults
 * @returns Configured Orchestrator instance with planner and worker
 */
export function createOrchestrator(
  overrides?: Partial<OrchestratorSettings>,
): Orchestrator {
  const defaultSettings: OrchestratorSettings = {
    model: overrides?.model ?? "xai/grok-4-fast-reasoning",
    system:
      overrides?.system ?? `You are Syner, an AI orchestrator for Syner OS.`,

    team: overrides?.team,
  };

  const orchestrator = new Orchestrator({
    ...defaultSettings,
    ...overrides,
  });

  // Inject default planner and worker
  // Users can override these by calling addPlanner/addAgent or passing them to run()
  orchestrator.addPlanner(createPlanner());
  orchestrator.addAgent("worker", createWorker());

  return orchestrator;
}
