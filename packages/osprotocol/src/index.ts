// @syner/osprotocol — Agent execution protocol
// context → action → verification lifecycle

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
