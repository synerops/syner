// @syner/osprotocol — Agent execution protocol
// context → action → verification lifecycle

export { type ContextSource, type Context, createContext } from './types/context'

export {
  type Effect,
  type Action,
  type Precondition,
  checkPreconditions,
  createAction,
} from './types/action'

export { type Skill } from './types/skill'

export {
  type Assertion,
  type Escalation,
  type Verification,
  escalate,
  verify,
} from './types/verification'

export { type Result, createResult } from './types/result'

export {
  validateAction,
  validateApproval,
  validateCancel,
  validateContext,
  validateResult,
  validateRun,
  validateVerification,
} from './validators'

export { type ParseResult, parseSkillManifest } from './parser'

export {
  type RunStatus,
  type RunActivity,
  type Progress,
  type Timeout,
  type Retry,
  type Approval,
  type Cancel,
  type Run,
  createRun,
  updateRunStatus,
} from './types/run'

// Run adapter contract
export { type RunAdapter } from './types/run-adapter'
export { type RunRequest, type RunEvent } from './types/run-request'

// System contract — session-level resource registry
export {
  type System,
  type WorkflowProvider,
  type SandboxProvider,
  type AgentProvider,
  type McpClient,
} from './types/system'

// Schemas — for consumers that want runtime validation
export {
  ContextSourceSchema,
  ContextSchema,
  PreconditionSchema,
  EffectSchema,
  ActionSchema,
  AssertionSchema,
  EscalationSchema,
  VerificationSchema,
  ResultSchema,
  SkillSchema,
  RunStatusSchema,
  RunActivitySchema,
  ProgressSchema,
  TimeoutSchema,
  RetrySchema,
  ApprovalSchema,
  CancelSchema,
  RunSchema,
} from './schemas'
