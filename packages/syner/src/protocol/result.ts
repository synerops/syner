import type { Context } from './context'
import type { Action } from './action'
import type { Verification } from './verification'

export interface Result<T = unknown> {
  context: Context
  action: Action
  verification: Verification
  output?: T
  duration: number
  chain?: string
}

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
