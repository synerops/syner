import type { ChangeProposal, SupervisorDecision } from '@syner/ops'

export interface DeployResult {
  deployed: boolean
  proposal: ChangeProposal
  reason: string
  timestamp: string
}

/**
 * Deploy approved changes. Only if decision.approved === true.
 * Rejected proposals are blocked with the reviewer's reason.
 */
export function deploy(
  proposal: ChangeProposal,
  decision: SupervisorDecision
): DeployResult {
  if (!decision.approved) {
    return {
      deployed: false,
      proposal,
      reason: `Rejected by ${decision.reviewer}: ${decision.reason}`,
      timestamp: new Date().toISOString(),
    }
  }

  return {
    deployed: true,
    proposal,
    reason: `Approved by ${decision.reviewer}: ${decision.reason}`,
    timestamp: new Date().toISOString(),
  }
}
