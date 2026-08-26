/**
 * Runs - Workflow Execution Control
 *
 * Imports types from @osprotocol/schema and provides SDK implementations.
 */

// Import types from OS Protocol
export type {
  RunOptions,
  RunStatus,
  Execution,
  ExecutionProgress,
  Timeout,
  TimeoutAction,
  Retry,
  Backoff,
  Cancel,
  Approval,
  ApprovalConfig,
  ApprovalRequest,
} from '@osprotocol/schema/runs'

// Import Workflow from OS Protocol (issue #60 resolved)
export type { Workflow, InferWorkflowOutput } from '@osprotocol/schema/workflows'

// SDK implementation
export { ExecutionImpl } from './execution'
