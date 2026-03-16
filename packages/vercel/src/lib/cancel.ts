import type { Cancel } from '@syner/osprotocol'

/**
 * Execute beforeCancel veto check.
 * If vetoFn returns false, cancellation is blocked.
 * OSProtocol spec keeps this even though Workflow doesn't support it natively.
 */
export async function checkBeforeCancel(
  vetoFn?: () => Promise<boolean>
): Promise<boolean> {
  if (!vetoFn) return true
  return vetoFn()
}

/**
 * Determine if cancellation should wait for graceful shutdown.
 * Returns the timeout in ms, or 0 for immediate cancel.
 */
export function gracefulTimeout(cancel?: Cancel): number {
  if (!cancel?.graceful) return 0
  return cancel.gracefulTimeoutMs ?? 5000
}
