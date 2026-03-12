// @syner/osprotocol — Agent execution protocol
// context → action → verification lifecycle

export { type ContextSource, type OspContext, createContext } from './types/context.js'

export {
  type Effect,
  type OspAction,
  type Precondition,
  checkPreconditions,
  createAction,
} from './types/action.js'

export {
  type InputField,
  type OutputField,
  type SkillManifestV2,
} from './types/skill-manifest.js'

export {
  type Assertion,
  type Escalation,
  type OspVerification,
  escalate,
  verify,
} from './types/verification.js'
