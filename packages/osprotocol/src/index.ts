// @syner/osprotocol — Agent execution protocol
// context → action → verification lifecycle

export { type ContextSource, type Context, type OspContext, createContext } from './types/context'

export {
  type Effect,
  type Action,
  type OspAction,
  type Precondition,
  checkPreconditions,
  createAction,
} from './types/action'

export { type Skill } from './types/skill'

export {
  type Assertion,
  type Escalation,
  type Verification,
  type OspVerification,
  escalate,
  verify,
} from './types/verification'

export { type Result, type OspResult, createResult } from './types/result'

export {
  validateAction,
  validateApproval,
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
  type Run,
  createRun,
  updateRunStatus,
} from './types/run'
