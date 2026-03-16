import {
  ContextSchema,
  ActionSchema,
  VerificationSchema,
  ResultSchema,
  RunSchema,
  ApprovalSchema,
  CancelSchema,
} from './schemas'
import type { Context, Action, Verification, Result, Run, Approval, Cancel } from './schemas'

export function validateContext(x: unknown): x is Context {
  return ContextSchema.safeParse(x).success
}

export function validateAction(x: unknown): x is Action {
  return ActionSchema.safeParse(x).success
}

export function validateVerification(x: unknown): x is Verification {
  return VerificationSchema.safeParse(x).success
}

export function validateResult(x: unknown): x is Result {
  return ResultSchema.safeParse(x).success
}

export function validateRun(x: unknown): x is Run {
  return RunSchema.safeParse(x).success
}

export function validateApproval(x: unknown): x is Approval {
  return ApprovalSchema.safeParse(x).success
}

export function validateCancel(x: unknown): x is Cancel {
  return CancelSchema.safeParse(x).success
}
