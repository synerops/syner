/**
 * Evaluator-Optimizer Workflow Implementation
 *
 * Generates output, evaluates it against criteria, and iteratively optimizes
 * until quality thresholds are met.
 *
 * @see https://www.anthropic.com/engineering/building-effective-agents
 */

import type { Workflow, RunOptions, Timeout, Retry, Cancel } from '../runs'
import type { Execution } from '@osprotocol/schema/runs'
import { ExecutionImpl } from '../runs/execution'

/**
 * Result for a single evaluation criterion
 */
export interface CriterionResult {
  /** Name of the criterion */
  name: string
  /** Score for this criterion (0.0 to 1.0) */
  score: number
  /** Whether this criterion passed */
  passed: boolean
  /** Feedback for this criterion */
  feedback?: string
}

/**
 * Evaluation result with score and feedback
 */
export interface Evaluation {
  /** Quality score (0.0 to 1.0) */
  score: number
  /** Whether the output meets the quality threshold */
  passed: boolean
  /** Feedback explaining the evaluation */
  feedback: string
  /** Specific criteria evaluations */
  criteria?: CriterionResult[]
  /** Current iteration number */
  iteration: number
}

/**
 * Configuration for an evaluation criterion
 */
export interface EvaluationCriterion {
  /** Name of the criterion */
  name: string
  /** Description of what this criterion evaluates */
  description: string
  /** Minimum score required to pass (0.0 to 1.0) */
  threshold: number
  /** Weight of this criterion in overall score */
  weight?: number
}

/**
 * Configuration for evaluator-optimizer workflow
 */
export interface EvaluatorOptimizerConfig<Output> {
  /** Function to generate initial output */
  generator: (prompt: string) => Promise<Output>
  /** Function to evaluate output */
  evaluator: (output: Output, prompt: string) => Promise<Omit<Evaluation, 'iteration'>>
  /** Function to optimize output based on feedback */
  optimizer: (
    output: Output,
    evaluation: Evaluation,
    prompt: string
  ) => Promise<Output>
  /** Minimum overall score to accept output (0.0 to 1.0) */
  threshold?: number
  /** Maximum optimization iterations before giving up */
  maxIterations?: number
}

/**
 * Evaluator-Optimizer workflow that generates, evaluates, and refines
 *
 * @example
 * ```typescript
 * const evalOpt = new EvaluatorOptimizer({
 *   generator: async (prompt) => {
 *     // Generate initial output with LLM
 *     return generatedText
 *   },
 *   evaluator: async (output, prompt) => {
 *     // Evaluate quality with LLM-as-judge
 *     return { score: 0.7, passed: false, feedback: '...' }
 *   },
 *   optimizer: async (output, evaluation, prompt) => {
 *     // Refine based on feedback
 *     return improvedOutput
 *   },
 *   threshold: 0.8,
 *   maxIterations: 3,
 * })
 *
 * const execution = await evalOpt.run("Write a compelling intro")
 * const result = await execution.result
 * ```
 */
export class EvaluatorOptimizer<Output> implements Workflow<Output> {
  timeout?: Timeout
  retry?: Retry
  cancel?: Cancel
  onComplete?: (result: Output) => void
  onFailed?: (error: Error) => void

  constructor(public config: EvaluatorOptimizerConfig<Output>) {}

  /**
   * Execute the evaluator-optimizer workflow and return an Execution handle.
   *
   * @param prompt - The input prompt
   * @param options - Optional run configuration
   * @returns Promise resolving to an Execution handle
   */
  async run(prompt: string, options?: RunOptions<Output>): Promise<Execution<Output>> {
    const execution = new ExecutionImpl<Output>(`evalopt_${Date.now()}`)

    // Execute asynchronously
    this.execute(prompt, execution, options)

    return execution
  }

  /**
   * Internal execution logic
   */
  private async execute(
    prompt: string,
    execution: ExecutionImpl<Output>,
    options?: RunOptions<Output>
  ): Promise<void> {
    const threshold = this.config.threshold ?? 0.8
    const maxIterations = this.config.maxIterations ?? 3

    try {
      execution.log(`Generating initial output for: ${prompt.slice(0, 50)}...`)
      execution.updateProgress(0, maxIterations + 1, 'Generating')

      // 1. Generate initial output
      let output = await this.generate(prompt)
      let iteration = 0

      // 2. Evaluate and optimize loop
      while (iteration < maxIterations) {
        iteration++
        execution.log(`Iteration ${iteration}: Evaluating output`)
        execution.updateProgress(iteration, maxIterations + 1, `Iteration ${iteration}`)

        const evaluation = await this.evaluate(output, prompt, iteration)

        if (evaluation.passed || evaluation.score >= threshold) {
          execution.log(`Passed with score ${evaluation.score}`)
          execution.updateProgress(maxIterations + 1, maxIterations + 1, 'Completed')
          execution.complete(output)

          options?.onComplete?.(output)
          this.onComplete?.(output)
          return
        }

        execution.log(`Score ${evaluation.score} < ${threshold}, optimizing...`)
        output = await this.optimize(output, evaluation, prompt)
      }

      // Return best effort after max iterations
      execution.log(`Max iterations (${maxIterations}) reached`)
      execution.updateProgress(maxIterations + 1, maxIterations + 1, 'Completed (max iterations)')
      execution.complete(output)

      options?.onComplete?.(output)
      this.onComplete?.(output)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      execution.fail(err)

      options?.onFailed?.(err)
      this.onFailed?.(err)
    }
  }

  /**
   * Generate initial output from the prompt
   *
   * @param prompt - The input prompt
   * @returns The generated output
   */
  async generate(prompt: string): Promise<Output> {
    return this.config.generator(prompt)
  }

  /**
   * Evaluate the output against quality criteria
   *
   * @param output - The output to evaluate
   * @param prompt - The original prompt
   * @param iteration - Current iteration number
   * @returns The evaluation result
   */
  async evaluate(
    output: Output,
    prompt: string,
    iteration: number
  ): Promise<Evaluation> {
    const result = await this.config.evaluator(output, prompt)
    return { ...result, iteration }
  }

  /**
   * Optimize the output based on evaluation feedback
   *
   * @param output - The current output
   * @param evaluation - The evaluation with feedback
   * @param prompt - The original prompt
   * @returns The optimized output
   */
  async optimize(
    output: Output,
    evaluation: Evaluation,
    prompt: string
  ): Promise<Output> {
    return this.config.optimizer(output, evaluation, prompt)
  }
}
