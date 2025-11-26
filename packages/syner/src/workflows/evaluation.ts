import type { Workflow } from '@syner/sdk'

// ============================================================================
// AgenticGenerator - Public Interface
// ============================================================================

/**
 * Contract for generator agents that create outputs.
 */
export interface AgenticGenerator<I = unknown, O = unknown> {
  /**
   * Generates output from input.
   * @param input - The input to generate from
   * @param feedback - Optional feedback from previous evaluation
   * @returns Generated output
   */
  generate(input: I, feedback?: string): Promise<O>
}

// ============================================================================
// AgenticEvaluator - Public Interface
// ============================================================================

/**
 * Evaluation result with score and feedback.
 */
export interface EvaluationResult {
  score: number
  feedback: string
  passed: boolean
}

/**
 * Contract for evaluator agents that assess outputs.
 */
export interface AgenticEvaluator<T = unknown> {
  /**
   * Evaluates an output against criteria.
   * @param output - The output to evaluate
   * @param criteria - Optional evaluation criteria
   * @returns Evaluation result with score and feedback
   */
  evaluate(output: T, criteria?: string): Promise<EvaluationResult>
}

// ============================================================================
// Generator - Default Implementation
// ============================================================================

export interface GeneratorConfig {
  // TODO: Add model, system prompt, etc.
}

/**
 * Default generator implementation using AI SDK.
 */
export class Generator<I = unknown, O = unknown>
  implements AgenticGenerator<I, O>
{
  constructor(private _config?: GeneratorConfig) {}

  async generate(_input: I, _feedback?: string): Promise<O> {
    throw new Error('Generator not implemented yet')
  }
}

// ============================================================================
// Evaluator - Default Implementation
// ============================================================================

export interface EvaluatorConfig {
  // TODO: Add model, system prompt, threshold, etc.
}

/**
 * Default evaluator implementation using AI SDK.
 */
export class Evaluator<T = unknown> implements AgenticEvaluator<T> {
  constructor(private _config?: EvaluatorConfig) {}

  async evaluate(_output: T, _criteria?: string): Promise<EvaluationResult> {
    throw new Error('Evaluator not implemented yet')
  }
}

// ============================================================================
// Evaluation - Workflow
// ============================================================================

export interface EvaluationConfig {
  generator: AgenticGenerator
  evaluator: AgenticEvaluator
  maxIterations?: number
  threshold?: number
}

/**
 * Evaluation workflow - iteratively generates and refines output until it passes evaluation.
 */
export class Evaluation<T> implements Workflow<T, EvaluationConfig> {
  constructor(public config: EvaluationConfig) {}

  async execute(_input: unknown): Promise<T> {
    throw new Error('Evaluation workflow not implemented yet')
  }
}
