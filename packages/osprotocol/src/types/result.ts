import type { OspContext } from './context.js'
import type { OspAction } from './action.js'
import type { OspVerification } from './verification.js'

export interface OspResult<T = unknown> {
  context: OspContext
  action: OspAction
  verification: OspVerification
  output?: T
  duration: number
  chain?: string
}

export function createResult<T = unknown>(
  context: OspContext,
  action: OspAction,
  verification: OspVerification,
  output?: T
): OspResult<T> {
  return {
    context,
    action,
    verification,
    output,
    duration: 0,
  }
}
