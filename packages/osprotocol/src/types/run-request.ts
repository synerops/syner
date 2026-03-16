import type { RunStatus } from '../schemas'

export interface RunRequest {
  prompt: string
  context?: {
    scope: 'none' | 'app' | 'project' | 'targeted' | 'full'
    app?: string
  }
  tools?: string[]
  metadata?: Record<string, unknown>
}

export interface RunEvent {
  runId: string
  from: RunStatus
  to: RunStatus
  timestamp: string
  metadata?: Record<string, unknown>
}
