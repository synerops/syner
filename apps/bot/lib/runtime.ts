import { createRuntime } from '@syner/vercel'

export const runtime = createRuntime()

/** Singleton start promise — ensures start() runs exactly once across all routes */
let startPromise: Promise<void> | null = null

export function ensureStarted(): Promise<void> {
  if (runtime.agents.size > 0) return Promise.resolve()
  if (!startPromise) {
    startPromise = runtime.start().catch((err) => {
      startPromise = null // allow retry on failure
      throw err
    })
  }
  return startPromise
}
