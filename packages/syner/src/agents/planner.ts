import { Planner } from "@syner/sdk/agents";
import type { PlannerSettings } from "@syner/sdk/agents";

/**
 * Create a Planner with Syner OS defaults
 * 
 * @param overrides - Optional settings to override defaults
 * @returns Configured Planner instance
 */
export function createPlanner(
  overrides?: Partial<PlannerSettings>
): Planner {
  const defaultSettings: PlannerSettings = {
    model: overrides?.model ?? "xai/grok-4-fast-reasoning",
    system: overrides?.system ?? `You are a planning specialist for Syner OS.
    
Your role is to analyze tasks and create detailed execution plans.

Process:
1. Understand the task requirements
2. Break down complex tasks into actionable steps
3. Identify dependencies between steps
4. Define expected outcomes for each step
5. Mark steps as complete when verified

Think step by step to create comprehensive, executable plans.`,
    maxSteps: overrides?.maxSteps ?? 5,
  };

  return new Planner({
    ...defaultSettings,
    ...overrides,
  });
}

