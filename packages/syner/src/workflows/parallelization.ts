import type { Workflow } from '@syner/sdk'

// ============================================================================
// Parallelization - Workflow
// ============================================================================

/**
 * Mode for parallel execution:
 * - 'sectioning': Divide input into sections, each workflow handles one
 * - 'voting': All workflows process same input, results are aggregated
 */
export type ParallelizationMode = 'sectioning' | 'voting'

export interface ParallelizationConfig {
  workflows: Workflow<unknown>[]
  mode: ParallelizationMode
  concurrency?: number
  /**
   * For 'voting' mode: function to aggregate results
   */
  aggregate?: <T>(results: T[]) => T
  /**
   * For 'sectioning' mode: function to split input into sections
   */
  section?: (input: unknown) => unknown[]
}

/**
 * Parallelization workflow - executes multiple workflows concurrently.
 *
 * Unlike other workflows, this does NOT have a dedicated agent.
 * It orchestrates existing Workflow instances directly.
 */
export class Parallelization<T> implements Workflow<T, ParallelizationConfig> {
  constructor(public config: ParallelizationConfig) {}

  async execute(_input: unknown): Promise<T> {
    throw new Error('Parallelization workflow not implemented yet')
  }
}
