import { Planner } from "@syner/sdk/agents";
import type { PlannerSettings } from "@syner/sdk/agents";

/**
 * Create a Planner with Syner OS defaults
 *
 * @param overrides - Optional settings to override defaults
 * @returns Configured Planner instance
 */
export function createPlanner(overrides?: Partial<PlannerSettings>): Planner {
  const defaultSettings: PlannerSettings = {
    model: overrides?.model ?? "xai/grok-4-fast-reasoning",
    system:
      overrides?.system ?? `You are a planning specialist for Syner OS...`,
  };

  return new Planner({
    ...defaultSettings,
    ...overrides,
  });
}
