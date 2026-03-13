import {
  validateResult,
  validateContext,
  validateAction,
  validateVerification,
  type OspVerification,
  type OspResult,
} from '@syner/osprotocol'

/**
 * Locally verify a remote OspResult.
 * Never trust remote verification alone — re-validate the structure
 * and cross-check assertions independently.
 */
export function validateRemoteResult(result: unknown): OspVerification {
  const assertions: OspVerification['assertions'] = []

  // 1. Structural validation — is it a valid OspResult at all?
  const isValidResult = validateResult(result)
  assertions.push({
    effect: 'Result has valid OspResult structure',
    result: isValidResult,
    evidence: isValidResult ? 'All required fields present and typed correctly' : 'Structural validation failed',
  })

  if (!isValidResult) {
    return {
      status: 'failed',
      assertions,
      escalation: {
        strategy: 'escalate',
        reason: 'Remote result is not a valid OspResult — cannot trust this response',
      },
    }
  }

  const ospResult = result as OspResult

  // 2. Context validation — does the context look legitimate?
  const hasValidContext = validateContext(ospResult.context)
  assertions.push({
    effect: 'Context is well-formed',
    result: hasValidContext,
    evidence: hasValidContext
      ? `agentId: ${ospResult.context.agentId}, skillRef: ${ospResult.context.skillRef}`
      : 'Context missing required fields',
  })

  // 3. Action validation — did the remote declare what it was doing?
  const hasValidAction = validateAction(ospResult.action)
  assertions.push({
    effect: 'Action declaration is well-formed',
    result: hasValidAction,
    evidence: hasValidAction
      ? `${ospResult.action.preconditions.length} preconditions, ${ospResult.action.expectedEffects.length} effects`
      : 'Action missing required fields',
  })

  // 4. Verification validation — did the remote include verification?
  const hasValidVerification = validateVerification(ospResult.verification)
  assertions.push({
    effect: 'Remote includes verification',
    result: hasValidVerification,
    evidence: hasValidVerification
      ? `Remote status: ${ospResult.verification.status}`
      : 'Verification missing or malformed',
  })

  // 5. Consistency check — do assertions match declared effects?
  if (hasValidAction && hasValidVerification) {
    const declaredEffects = ospResult.action.expectedEffects.map((e) => e.description)
    const verifiedEffects = ospResult.verification.assertions.map((a) => a.effect)
    const allEffectsVerified = declaredEffects.every((e) => verifiedEffects.includes(e))

    assertions.push({
      effect: 'All declared effects have corresponding assertions',
      result: allEffectsVerified,
      evidence: allEffectsVerified
        ? `${declaredEffects.length} effects, ${verifiedEffects.length} assertions`
        : `Missing assertions for: ${declaredEffects.filter((e) => !verifiedEffects.includes(e)).join(', ')}`,
    })
  }

  // 6. Duration sanity check — was the response suspiciously fast?
  const hasReasonableDuration = typeof ospResult.duration === 'number' && ospResult.duration >= 0
  assertions.push({
    effect: 'Duration is reasonable',
    result: hasReasonableDuration,
    evidence: `${ospResult.duration}ms`,
  })

  // Determine overall status
  const passed = assertions.filter((a) => a.result).length
  const total = assertions.length

  let status: OspVerification['status']
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
