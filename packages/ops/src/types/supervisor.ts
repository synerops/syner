import type { Proposal } from './changes'

/**
 * A supervisor decision on a change proposal.
 * The supervisor MUST be a separate entity from the agent being evaluated.
 */
export interface SupervisorDecision {
  proposal: Proposal
  approved: boolean
  reason: string
  reviewer: string
  timestamp: string
}

export interface Decisions {
  decisions: SupervisorDecision[]
  patterns: string[]
}

/** @deprecated Use Decisions instead */
export type DecisionCorpus = Decisions
