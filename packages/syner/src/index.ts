/**
 * Syner - Default Orchestrator for Syner OS
 *
 * This package provides AI SDK-specific implementations of the
 * workflow patterns defined in @syner/sdk.
 */

// Tools (AI SDK tool factories)
export { route, type RouteConfig, type RouteMetadata } from './tools'

// Workflows (AI SDK-specific implementations)
export { Routing, type RoutingConfig, type InferRoutingOutput } from './workflows/routing'

// Agents
export { Router } from './agents/router'

// Re-export SDK base workflows for extensibility
// Users can extend these with their own implementations
export {
  // Base workflow classes
  Routing as BaseRouting,
  OrchestratorWorkers,
  Parallelization,
  EvaluatorOptimizer,
  // Configuration types
  type RoutingConfig as BaseRoutingConfig,
  type RoutingWorkflowEntry,
  type RouteConfig as BaseRouteConfig,
  type OrchestratorWorkersConfig,
  type ParallelizationConfig,
  type EvaluatorOptimizerConfig,
  // Plan types
  type Plan,
  type PlanStep,
  type WorkerResult,
  type WorkerConfig,
  // Parallelization types
  type Subtask,
  type SubtaskResult,
  // Evaluation types
  type Evaluation,
  type EvaluationCriterion,
  type CriterionResult,
} from '@syner/sdk/workflows'
