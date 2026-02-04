/**
 * Workflow Patterns
 *
 * SDK implementations of the OS Protocol workflow patterns.
 * Based on Anthropic's building blocks for agentic systems.
 *
 * @see https://www.anthropic.com/engineering/building-effective-agents
 */

// Routing pattern - classify and delegate
export {
  Routing,
  type RoutingConfig,
  type RoutingWorkflowEntry,
  type RouteConfig,
  type InferRoutingOutput,
} from './routing'

// Orchestrator-Workers pattern - plan, delegate, synthesize
export {
  OrchestratorWorkers,
  type OrchestratorWorkersConfig,
  type Plan,
  type PlanStep,
  type WorkerResult,
  type WorkerConfig,
} from './orchestrator-workers'

// Parallelization pattern - split, parallel execute, merge
export {
  Parallelization,
  type ParallelizationConfig,
  type Subtask,
  type SubtaskResult,
} from './parallelization'

// Evaluator-Optimizer pattern - generate, evaluate, refine
export {
  EvaluatorOptimizer,
  type EvaluatorOptimizerConfig,
  type Evaluation,
  type EvaluationCriterion,
  type CriterionResult,
} from './evaluator-optimizer'
