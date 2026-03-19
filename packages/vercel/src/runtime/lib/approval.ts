import type { Approval } from '@syner/osprotocol'

/**
 * Generate a deterministic approval hook token for a run.
 * Convention: `run:{runId}:approval`
 */
export function approvalToken(runId: string): string {
  return `run:${runId}:approval`
}

/**
 * Check if quorum is met for multi-approval scenarios.
 */
export function isQuorumMet(
  approvals: Approval[],
  requiredApprovals: number
): boolean {
  const approved = approvals.filter((a) => a.approved)
  return approved.length >= requiredApprovals
}

/**
 * Create an auto-approval for timeout scenarios where `autoApproveOnTimeout` is set.
 */
export function createAutoApproval(): Approval {
  return {
    approved: true,
    reason: 'Auto-approved on timeout',
    approvedBy: 'system',
    timestamp: new Date().toISOString(),
  }
}
