// TODO: Migrate to synerops/protocol

export type Backoff = 'none' | 'linear' | 'exponential'

export interface Retry {
  attempts: number
  waitFor: number
  backoff?: Backoff
  onRetry?: (error: Error, attempt: number) => void
}
