import type { ChangeProposal, EvalResult, SupervisorDecision } from '@syner/ops'
import { logDecision } from './corpus'

const SUPERVISOR_API_URL = process.env.SYNER_BOT_URL || 'http://localhost:3000'

export async function requestApproval(
  proposal: ChangeProposal,
  evalResult: EvalResult
): Promise<SupervisorDecision> {
  const response = await fetch(`${SUPERVISOR_API_URL}/api/supervisor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proposal, evalResult }),
  })

  if (!response.ok) {
    throw new Error(`Supervisor API returned ${response.status}`)
  }

  const decision = (await response.json()) as SupervisorDecision

  await logDecision(decision)

  return decision
}
