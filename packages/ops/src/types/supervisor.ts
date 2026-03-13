import type { Approval } from '@syner/osprotocol'

export interface Decisions {
  decisions: Approval[]
  patterns: string[]
}

/** @deprecated Import Approval from @syner/osprotocol */
export type Decision = Approval

/** @deprecated Use Decisions instead */
export type DecisionCorpus = Decisions

/** @deprecated Import Approval from @syner/osprotocol */
export type SupervisorDecision = Approval
