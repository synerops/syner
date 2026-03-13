import type { Proposal, Evaluation } from '@syner/ops'

export interface SupervisorPrompt {
  text: string
  blocks: SlackBlock[]
}

interface SlackBlock {
  type: string
  text?: { type: string; text: string }
  elements?: Array<{ type: string; text: { type: string; text: string }; action_id: string; style?: string }>
  block_id?: string
}

export function buildSupervisorPrompt(proposal: Proposal, evalResult: Evaluation): SupervisorPrompt {
  const statusEmoji = evalResult.passed ? ':white_check_mark:' : ':warning:'
  const regressionNote = evalResult.regressions.length > 0
    ? `\n*Regressions:* ${evalResult.regressions.join(', ')}`
    : ''

  const metricsText = evalResult.metricResults
    .map((m) => `  ${m.metric}: ${m.actual.toFixed(2)} (required: ${m.required})`)
    .join('\n')

  const text = [
    `${statusEmoji} *Change Proposal: ${proposal.category}*`,
    `*Skill:* ${proposal.skillRef}`,
    `*Description:* ${proposal.description}`,
    `*Tests:* ${evalResult.testResults.filter((t) => t.passed).length}/${evalResult.testResults.length} passed`,
    metricsText ? `*Metrics:*\n${metricsText}` : '',
    regressionNote,
  ].filter(Boolean).join('\n')

  const blocks: SlackBlock[] = [
    {
      type: 'section',
      text: { type: 'mrkdwn', text },
    },
    {
      type: 'actions',
      block_id: `supervisor_${proposal.skillRef}_${Date.now()}`,
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Approve' },
          action_id: 'supervisor_approve',
          style: 'primary',
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Reject' },
          action_id: 'supervisor_reject',
          style: 'danger',
        },
      ],
    },
  ]

  return { text, blocks }
}
