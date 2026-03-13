import type { ChangeProposal, SupervisorDecision, EvalResult } from '@syner/ops'
import { logDecision } from './corpus'

export interface SupervisorGateOptions {
  /** Bot URL for sending approval requests */
  botUrl?: string
  /** Slack channel for supervisor notifications */
  channel?: string
}

/**
 * Request human-in-the-loop approval for a change proposal.
 * Sends the proposal to the supervisor via syner.bot (Slack),
 * logs the decision, and returns it.
 *
 * The supervisor MUST be a separate entity from the agent being evaluated.
 */
export async function requestApproval(
  proposal: ChangeProposal,
  evalResult: EvalResult,
  options: SupervisorGateOptions = {}
): Promise<SupervisorDecision> {
  const {
    botUrl = process.env.SYNER_BOT_URL || 'http://localhost:3001',
    channel = process.env.SYNER_SUPERVISOR_CHANNEL || 'self-dev',
  } = options

  // Send proposal to bot for Slack notification
  const response = await fetch(`${botUrl}/api/supervisor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proposal, evalResult, channel }),
  })

  if (!response.ok) {
    throw new Error(`Supervisor request failed: ${response.status}`)
  }

  const { decision } = (await response.json()) as { decision: SupervisorDecision }

  // Log every decision — these form the training corpus for future automation
  await logDecision(decision)

  return decision
}
