import type { Retry } from '@syner/osprotocol'

/**
 * Compute delay for a retry attempt using the configured backoff strategy.
 * Returns milliseconds, capped at maxDelayMs if set.
 */
export function computeDelay(retry: Retry, attempt: number): number {
  const base = retry.delay
  const delay =
    retry.backoff === 'exponential'
      ? base * Math.pow(2, attempt)
      : base * (attempt + 1)
  return Math.min(delay, retry.maxDelayMs ?? Infinity)
}

/**
 * Determine if an error should be retried based on attempt count.
 * Returns true if we haven't exhausted maxAttempts.
 */
export function shouldRetry(retry: Retry, attempt: number): boolean {
  return attempt < retry.maxAttempts
}
