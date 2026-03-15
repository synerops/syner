import type { Approval } from '@syner/osprotocol'

export interface PendingApproval {
  runId: string
  description: string
  requestedAt: string
  approval: Approval
}

/** In-memory store for pending approvals (replaced by durable storage later) */
export const pendingApprovals = new Map<string, PendingApproval>()

/**
 * Register a pending approval (called internally by chain steps).
 */
export function registerApproval(
  runId: string,
  description: string
): PendingApproval {
  const pending: PendingApproval = {
    runId,
    description,
    requestedAt: new Date().toISOString(),
    approval: {
      required: true,
    },
  }
  pendingApprovals.set(runId, pending)
  return pending
}

/**
 * Check if an approval has been decided.
 */
export function getApprovalStatus(runId: string): Approval | undefined {
  return pendingApprovals.get(runId)?.approval
}
