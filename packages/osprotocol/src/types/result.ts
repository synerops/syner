export type { Result } from '../schemas'

import type { Context, Action, Verification, Result } from '../schemas'

export function createResult<T = unknown>(
  context: Context,
  action: Action,
  verification: Verification,
  output?: T
): Result<T> {
  return {
    context,
    action,
    verification,
    output,
    duration: 0,
  }
}
