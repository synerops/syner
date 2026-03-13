import type { Proposal, Evaluation } from '@syner/ops'
import type { Approval } from '@syner/osprotocol'
import { logDecision, type SelfDevDecision } from './corpus'

const SUPERVISOR_API_URL = process.env.SYNER_BOT_URL || 'http://localhost:3000'

export async function requestApproval(
  proposal: Proposal,
  evalResult: Evaluation
): Promise<Approval> {
  const response = await fetch(`${SUPERVISOR_API_URL}/api/supervisor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proposal, evalResult }),
  })

  if (!response.ok) {
    throw new Error(`Supervisor API returned ${response.status}`)
  }

  const approval = (await response.json()) as Approval

  const decision: SelfDevDecision = { proposal, approval }
  await logDecision(decision)

  return approval
}
