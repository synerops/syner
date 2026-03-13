import type { Context } from './types/context'
import type { Action } from './types/action'
import type { Verification } from './types/verification'
import type { Result } from './types/result'
import type { Run, RunStatus, Approval } from './types/run'

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x)
}

function isString(x: unknown): x is string {
  return typeof x === 'string'
}

function isArray(x: unknown): x is unknown[] {
  return Array.isArray(x)
}

export function validateContext(x: unknown): x is Context {
  if (!isObject(x)) return false
  if (!isString(x.agentId)) return false
  if (!isString(x.skillRef)) return false
  if (!isArray(x.loaded)) return false
  if (!isArray(x.missing)) return false
  if (!isString(x.timestamp)) return false
  return true
}

export function validateAction(x: unknown): x is Action {
  if (!isObject(x)) return false
  if (!isString(x.description)) return false
  if (!isArray(x.preconditions)) return false
  if (!isArray(x.expectedEffects)) return false
  if (x.rollbackStrategy !== undefined) {
    if (!['revert', 'escalate', 'noop'].includes(x.rollbackStrategy as string)) return false
  }
  return true
}

export function validateVerification(x: unknown): x is Verification {
  if (!isObject(x)) return false
  if (!isString(x.status)) return false
  if (!['passed', 'failed', 'partial'].includes(x.status as string)) return false
  if (!isArray(x.assertions)) return false
  return true
}

export function validateResult(x: unknown): x is Result {
  if (!isObject(x)) return false
  if (!validateContext(x.context)) return false
  if (!validateAction(x.action)) return false
  if (!validateVerification(x.verification)) return false
  if (typeof x.duration !== 'number') return false
  return true
}

const VALID_RUN_STATUSES: RunStatus[] = [
  'pending', 'running', 'waiting_approval', 'approved', 'rejected',
  'completed', 'failed', 'cancelled', 'timed_out',
]

export function validateApproval(x: unknown): x is Approval {
  if (!isObject(x)) return false
  if (typeof x.required !== 'boolean') return false
  if (x.reviewer !== undefined && !isString(x.reviewer)) return false
  if (x.decision !== undefined) {
    if (!['approved', 'rejected'].includes(x.decision as string)) return false
  }
  if (x.reason !== undefined && !isString(x.reason)) return false
  if (x.timestamp !== undefined && !isString(x.timestamp)) return false
  return true
}

export function validateRun(x: unknown): x is Run {
  if (!isObject(x)) return false
  if (!isString(x.id)) return false
  if (!isString(x.status)) return false
  if (!VALID_RUN_STATUSES.includes(x.status as RunStatus)) return false
  if (!isArray(x.results)) return false
  if (!isString(x.startedAt)) return false
  if (x.approval !== undefined && !validateApproval(x.approval)) return false
  if (x.timeout !== undefined) {
    if (!isObject(x.timeout)) return false
    if (typeof (x.timeout as Record<string, unknown>).duration !== 'number') return false
    if (!['fail', 'escalate', 'cancel'].includes((x.timeout as Record<string, unknown>).strategy as string)) return false
  }
  if (x.retry !== undefined) {
    if (!isObject(x.retry)) return false
    if (typeof (x.retry as Record<string, unknown>).maxAttempts !== 'number') return false
    if (typeof (x.retry as Record<string, unknown>).delay !== 'number') return false
  }
  return true
}
