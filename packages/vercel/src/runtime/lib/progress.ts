import type { Progress } from '@syner/osprotocol'

export interface ProgressEvent {
  progress: Progress
  timestamp: string
}

/**
 * Create a progress event for streaming via getWritable().
 */
export function createProgressEvent(current: number, label?: string): ProgressEvent {
  return {
    progress: { current, ...(label ? { label } : {}) },
    timestamp: new Date().toISOString(),
  }
}
