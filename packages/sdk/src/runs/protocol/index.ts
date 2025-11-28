// TODO: Migrate to synerops/protocol

import type { Timeout } from './timeout'
import type { Retry } from './retries'
import type { Cancel } from './cancel'
import type { Approval } from './human-in-the-loop'

export type { Timeout } from './timeout'
export type { Retry, Backoff } from './retries'
export type { Cancel } from './cancel'
export type { Approval } from './human-in-the-loop'

export type Status =
  | 'in-progress'
  | 'awaiting'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface Run<T> {
  workflow: Workflow<T>
  timeout?: Timeout
  retry?: Retry
  cancel?: Cancel
  onComplete?: (result: T) => void
  onFailed?: (error: Error) => void
}

export interface Execution<T> {
  cancel(reason?: string): Promise<void>
  pause(): Promise<void>
  resume(): Promise<void>
  waitForApproval(message?: string): Promise<Approval>
  waitForInput<I>(prompt: string): Promise<I>
  status: Status
  progress: { current: number; total: number }
  logs: string[]
  result: Promise<T>
}

// Workflow protocol interface
export interface Workflow<Output> {
  timeout?: Timeout
  retry?: Retry
  cancel?: Cancel
  onComplete?: (result: Output) => void
  onFailed?: (error: Error) => void
  run(prompt: string, options?: Run<Output>): Promise<Output>
}

// Type inference utilities
export type InferWorkflowOutput<T> = 
  T extends Workflow<infer Output> ? Output : never
