export type { RunStatus, RunActivity, Progress, Timeout, Retry, Approval, Cancel, Run } from '../schemas'

import type { Run, RunStatus } from '../schemas'

export function createRun(partial: Partial<Run> & Pick<Run, 'id'>): Run {
  return {
    status: 'pending',
    results: [],
    startedAt: new Date().toISOString(),
    ...partial,
  }
}

const validTransitions: Record<string, RunStatus[]> = {
  pending: ['in-progress'],
  'in-progress': ['awaiting', 'completed', 'failed', 'cancelled'],
  awaiting: ['in-progress', 'cancelled'],
}

export function updateRunStatus(run: Run, newStatus: RunStatus): Run {
  const allowed = validTransitions[run.status]
  if (!allowed || !allowed.includes(newStatus)) {
    throw new Error(`Invalid transition from ${run.status} to ${newStatus}`)
  }
  return { ...run, status: newStatus }
}
