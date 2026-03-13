/**
 * Supervisor Gate API
 *
 * Handles approval workflows for chain steps that require human approval.
 * GET: list pending approvals. POST: submit a decision.
 */

import type { Approval } from '@syner/osprotocol'

/** In-memory store for pending approvals (replaced by durable storage later) */
const pendingApprovals = new Map<string, PendingApproval>()

export interface PendingApproval {
  runId: string
  description: string
  requestedAt: string
  approval: Approval
}

/**
 * GET /api/supervisor — List pending approval requests
 */
export async function GET() {
  const pending = Array.from(pendingApprovals.values()).filter(
    (p) => !p.approval.decision
  )
  return Response.json(pending)
}

/**
 * POST /api/supervisor — Submit an approval decision
 */
export async function POST(request: Request) {
  const body = await request.json() as {
    runId: string
    decision: 'approved' | 'rejected'
    reason?: string
  }

  if (!body.runId || !body.decision) {
    return Response.json(
      { error: 'runId and decision are required' },
      { status: 400 }
    )
  }

  if (body.decision !== 'approved' && body.decision !== 'rejected') {
    return Response.json(
      { error: 'decision must be "approved" or "rejected"' },
      { status: 400 }
    )
  }

  const pending = pendingApprovals.get(body.runId)
  if (!pending) {
    return Response.json(
      { error: `No pending approval found for runId: ${body.runId}` },
      { status: 404 }
    )
  }

  // Apply the decision
  pending.approval.decision = body.decision
  pending.approval.reason = body.reason
  pending.approval.timestamp = new Date().toISOString()

  return Response.json({
    runId: body.runId,
    decision: body.decision,
    reason: body.reason,
    processedAt: pending.approval.timestamp,
  })
}

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
