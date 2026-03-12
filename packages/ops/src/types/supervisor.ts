import type { ChangeProposal } from './changes'

/**
 * A supervisor decision on a change proposal.
 * The supervisor MUST be a separate entity from the agent being evaluated.
 */
export interface SupervisorDecision {
  proposal: ChangeProposal
  approved: boolean
  reason: string
  reviewer: string
  timestamp: string
}

export interface DecisionCorpus {
  decisions: SupervisorDecision[]
  patterns: string[]
}
