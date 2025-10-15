import { Worker, type WorkerSettings } from "@syner/sdk/agents";

/**
 * Create a Worker with Syner defaults
 *
 * Defaults:
 * - Model: xai/grok-4-fast-reasoning
 *
 * @param overrides - Optional partial settings to override defaults
 * @returns Worker instance with Syner defaults
 */
export function createWorker(overrides?: Partial<WorkerSettings>): Worker {
  const defaultSettings: WorkerSettings = {
    model: "anthropic/claude-instant-v1",
  };
  return new Worker({
    ...defaultSettings,
    ...overrides,
  });
}
