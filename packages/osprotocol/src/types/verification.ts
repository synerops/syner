export type { Assertion, Escalation, Verification } from '../schemas'

import type { Effect, Assertion, Verification, Escalation } from '../schemas'

export function verify(
  effects: Effect[],
  results: Record<string, boolean>
): Verification {
  const assertions: Assertion[] = effects.map((effect) => ({
    effect: effect.description,
    result: results[effect.description] ?? false,
  }))

  const passed = assertions.filter((a) => a.result).length
  const total = assertions.length

  let status: Verification['status']
  if (passed === total) status = 'passed'
  else if (passed === 0) status = 'failed'
  else status = 'partial'

  return { status, assertions }
}

export function escalate(verification: Verification, target: string): Escalation {
  const failed = verification.assertions.filter((a) => !a.result)
  return {
    strategy: 'escalate',
    target,
    reason: `${failed.length} assertion(s) failed: ${failed.map((a) => a.effect).join(', ')}`,
  }
}
