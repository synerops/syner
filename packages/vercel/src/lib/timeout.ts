import type { Timeout } from '@syner/osprotocol'

export type TimeoutAction = 'fail' | 'cancel' | 'continue'

/**
 * Resolve what action to take when a timeout fires.
 * Maps OSProtocol Timeout.strategy to a concrete action.
 */
export function resolveTimeoutAction(timeout: Timeout): TimeoutAction {
  return timeout.strategy
}

/**
 * Create a timeout race: resolves with 'timed_out' after duration ms.
 * Use with Promise.race against the actual work.
 */
export function createTimeoutRace(timeout: Timeout): Promise<'timed_out'> {
  return new Promise((resolve) => {
    setTimeout(() => resolve('timed_out'), timeout.duration)
  })
}
