import {
  validateResult,
  validateContext,
  validateAction,
  validateVerification,
  type Result,
  type Verification,
} from '@syner/osprotocol'

/**
 * Local verification of a remote Result.
 * Never trust remote verification alone — re-validate the structure
 * and cross-check assertions locally.
 */
export function validateRemoteResult(result: unknown): Verification {
  const assertions: Array<{ effect: string; result: boolean; evidence?: string }> = []

  // 1. Structural validation — is it a valid Result shape?
  const isValidShape = validateResult(result)
  assertions.push({
    effect: 'Result has valid Result structure',
    result: isValidShape,
    evidence: isValidShape ? undefined : 'Failed structural validation',
  })

  if (!isValidShape) {
    return {
      status: 'failed',
      assertions,
      escalation: {
        strategy: 'escalate',
        reason: 'Remote result is not a valid Result — cannot trust this response',
      },
    }
  }

  const ospResult = result as Result

  // 2. Context integrity
  const validContext = validateContext(ospResult.context)
  assertions.push({
    effect: 'Context is well-formed',
    result: validContext,
    evidence: validContext
      ? `agentId: ${ospResult.context.agentId}, skillRef: ${ospResult.context.skillRef}`
      : 'Context missing required fields',
  })

  // 3. Action integrity
  const validAction = validateAction(ospResult.action)
  assertions.push({
    effect: 'Action is well-formed',
    result: validAction,
    evidence: validAction
      ? `${ospResult.action.preconditions.length} preconditions, ${ospResult.action.expectedEffects.length} effects`
      : 'Action missing required fields',
  })

  // 4. Verification integrity — remote says it passed, do we agree?
  const validVerification = validateVerification(ospResult.verification)
  assertions.push({
    effect: 'Verification block is well-formed',
    result: validVerification,
    evidence: validVerification
      ? `Remote status: ${ospResult.verification.status}`
      : 'Verification missing or malformed',
  })

  // 5. Cross-check: remote assertions should reference declared effects
  if (validAction && validVerification) {
    const declaredEffects = new Set(
      ospResult.action.expectedEffects.map((e) => e.description)
    )
    const assertedEffects = ospResult.verification.assertions.map((a) => a.effect)
    const allMapped = assertedEffects.every((e) => declaredEffects.has(e))

    assertions.push({
      effect: 'All assertions map to declared effects',
      result: allMapped,
      evidence: allMapped ? undefined : 'Found assertions referencing undeclared effects',
    })
  }

  // 6. Duration sanity check
  const validDuration = typeof ospResult.duration === 'number' && ospResult.duration >= 0
  assertions.push({
    effect: 'Duration is non-negative',
    result: validDuration,
    evidence: `${ospResult.duration}ms`,
  })

  // Compute status
  const passed = assertions.filter((a) => a.result).length
  const total = assertions.length

  let status: Verification['status']
  if (passed === total) status = 'passed'
  else if (passed === 0) status = 'failed'
  else status = 'partial'

  return {
    status,
    assertions,
    ...(status !== 'passed' && {
      escalation: {
        strategy: 'escalate',
        reason: `Local verification: ${passed}/${total} checks passed — remote output may not be trustworthy`,
      },
    }),
  }
}
