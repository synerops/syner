import type { OspContext } from './context'
import type { OspAction } from './action'
import type { OspVerification } from './verification'

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
