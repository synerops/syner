import type { ChangeProposal } from '@syner/ops'
import type { EvalResult } from '@syner/ops'

export function formatProposalForSlack(proposal: ChangeProposal, evalResult: EvalResult): string {
  const status = evalResult.passed ? ':white_check_mark: Passed' : ':x: Failed'
  const regressions = evalResult.regressions.length > 0
    ? `\n*Regressions:* ${evalResult.regressions.join(', ')}`
    : ''

  return [
    `*Self-Development Proposal*`,
    `*Skill:* ${proposal.skillRef}`,
    `*Category:* ${proposal.category}`,
    `*Description:* ${proposal.description}`,
    `*Evaluation:* ${status}${regressions}`,
    '',
    `*Metrics:*`,
    ...evalResult.metricResults.map(
      (m) => `  • ${m.metric}: ${m.actual.toFixed(2)} (required: ${m.required})`
    ),
    '',
    'Reply with *approve* or *reject* followed by your reason.',
  ].join('\n')
}
