// @syner/osprotocol — Agent execution protocol
// context → action → verification lifecycle

export { type ContextSource, type OspContext, createContext } from './types/context'

export {
  type Effect,
  type OspAction,
  type Precondition,
  checkPreconditions,
  createAction,
} from './types/action'

export {
  type InputField,
  type OutputField,
  type SkillManifestV2,
} from './types/skill-manifest'

export {
  type Assertion,
  type Escalation,
  type OspVerification,
  escalate,
  verify,
} from './types/verification'

export { type OspResult, createResult } from './types/result'

export {
  validateAction,
  validateContext,
  validateResult,
  validateVerification,
} from './validators'

export { parseSkillManifest } from './parser'
