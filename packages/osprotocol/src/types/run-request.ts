import type { RunStatus } from '../schemas'

export interface RunRequest {
  prompt: string
  agent: string
}

export interface RunEvent {
  runId: string
  from: RunStatus
  to: RunStatus
  timestamp: string
  metadata?: Record<string, unknown>
}
