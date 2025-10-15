import { Orchestrator } from "@syner/sdk/agents";
import type { OrchestratorSettings } from "@syner/sdk/agents";
import { createPlanner } from "./planner";

/**
 * Create an Orchestrator with Syner OS defaults
 * 
 * Automatically injects default Planner and Executor instances,
 * enabling the orchestrator.run() method out of the box.
 * 
 * @param overrides - Optional settings to override defaults
 * @returns Configured Orchestrator instance with planner and executor
 */
export function createOrchestrator(
  overrides?: Partial<OrchestratorSettings>
): Orchestrator {
  const defaultSettings: OrchestratorSettings = {
    model: overrides?.model ?? "xai/grok-4-fast-reasoning",
    system: overrides?.system ?? `You are Syner, an AI orchestrator for Syner OS.

Your role is to coordinate tasks and manage resources within a team.

Capabilities:
- Orchestrate complex multi-step workflows
- Coordinate between specialized agents
- Manage task execution and verification
- Provide clear feedback and observations

You work iteratively, planning, executing, and adapting based on observations.`,

    team: overrides?.team,
  };

  const orchestrator = new Orchestrator({
    ...defaultSettings,
    ...overrides,
  });

  // Inject default planner and executor
  // Users can override these by calling addPlanner/addExecutor or passing them to run()
  orchestrator.addAgent("planner", createPlanner());

  return orchestrator;
}
