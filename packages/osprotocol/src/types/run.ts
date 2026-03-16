import type { Result } from './result'

export type RunStatus =
  | 'pending'
  | 'in-progress'
  | 'awaiting'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type RunActivity = 'idle' | 'executing' | 'waiting' | 'thinking'

export interface Progress {
  current: number
  label?: string
}

export interface Timeout {
  /** Duration in milliseconds */
  duration: number
  strategy: 'fail' | 'cancel' | 'continue'
}

export interface Retry {
  maxAttempts: number
  /** Delay in milliseconds */
  delay: number
  backoff?: 'linear' | 'exponential'
  /** Maximum delay in milliseconds (caps exponential backoff) */
  maxDelayMs?: number
}

export interface Approval {
  approved: boolean
  reason?: string
  /** Agent ID as plain string */
  approvedBy?: string
  /** ISO 8601 timestamp */
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface Cancel {
  reason?: string
  graceful?: boolean
  /** Timeout in milliseconds for graceful cancellation */
  gracefulTimeoutMs?: number
  allowVeto?: boolean
  metadata?: Record<string, unknown>
}

export interface Run<T = unknown> {
  id: string
  status: RunStatus
  results: Result<T>[]
  progress?: Progress
  approval?: Approval
  timeout?: Timeout
  retry?: Retry
  cancel?: Cancel
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
