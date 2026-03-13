import type { Result } from './result'

export type RunStatus =
  | 'pending'
  | 'running'
  | 'waiting_approval'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timed_out'

export type RunActivity = 'idle' | 'executing' | 'waiting' | 'thinking'

export interface Progress {
  current: number
  total: number
  label?: string
}

export interface Timeout {
  /** Duration in milliseconds */
  duration: number
  strategy: 'fail' | 'escalate' | 'cancel'
  target?: string
}

export interface Retry {
  maxAttempts: number
  /** Delay in milliseconds */
  delay: number
  backoff?: 'linear' | 'exponential'
}

export interface Approval {
  required: boolean
  /** Agent ID as plain string */
  reviewer?: string
  decision?: 'approved' | 'rejected'
  reason?: string
  /** ISO 8601 timestamp */
  timestamp?: string
}

export interface Run<T = unknown> {
  id: string
  status: RunStatus
  results: Result<T>[]
  progress?: Progress
  approval?: Approval
  timeout?: Timeout
  retry?: Retry
  startedAt: string
  completedAt?: string
  chain?: string
  activity?: RunActivity
  /** ISO 8601 timestamp */
  lastHeartbeat?: string
}

export function createRun(partial: Partial<Run> & Pick<Run, 'id'>): Run {
  return {
    status: 'pending',
    results: [],
    startedAt: new Date().toISOString(),
    ...partial,
  }
}

const validTransitions: Record<string, RunStatus[]> = {
  pending: ['running'],
  running: ['completed', 'failed', 'cancelled', 'waiting_approval', 'timed_out'],
  waiting_approval: ['approved', 'rejected'],
  approved: ['running'],
  rejected: ['cancelled', 'running'],
}

export function updateRunStatus(run: Run, newStatus: RunStatus): Run {
  const allowed = validTransitions[run.status]
  if (!allowed || !allowed.includes(newStatus)) {
    throw new Error(`Invalid transition from ${run.status} to ${newStatus}`)
  }
  return { ...run, status: newStatus }
}
