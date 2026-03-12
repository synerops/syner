import type { OspContext } from './types/context'
import type { OspAction } from './types/action'
import type { OspVerification } from './types/verification'
import type { OspResult } from './types/result'

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x)
}

function isString(x: unknown): x is string {
  return typeof x === 'string'
}

function isArray(x: unknown): x is unknown[] {
  return Array.isArray(x)
}

export function validateContext(x: unknown): x is OspContext {
  if (!isObject(x)) return false
  if (!isString(x.agentId)) return false
  if (!isString(x.skillRef)) return false
  if (!isArray(x.loaded)) return false
  if (!isArray(x.missing)) return false
  if (!isString(x.timestamp)) return false
  return true
}

export function validateAction(x: unknown): x is OspAction {
  if (!isObject(x)) return false
  if (!isString(x.description)) return false
  if (!isArray(x.preconditions)) return false
  if (!isArray(x.expectedEffects)) return false
  if (x.rollbackStrategy !== undefined) {
    if (!['revert', 'escalate', 'noop'].includes(x.rollbackStrategy as string)) return false
  }
  return true
}

export function validateVerification(x: unknown): x is OspVerification {
  if (!isObject(x)) return false
  if (!isString(x.status)) return false
  if (!['passed', 'failed', 'partial'].includes(x.status as string)) return false
  if (!isArray(x.assertions)) return false
  return true
}

export function validateResult(x: unknown): x is OspResult {
  if (!isObject(x)) return false
  if (!validateContext(x.context)) return false
  if (!validateAction(x.action)) return false
  if (!validateVerification(x.verification)) return false
  if (typeof x.duration !== 'number') return false
  return true
}
