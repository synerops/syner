import {
  verify,
  validateResult,
  type OspResult,
  type OspVerification,
} from '@syner/osprotocol'

/**
 * Local verification of remote output.
 * Never trust remote verification alone — re-verify locally.
 */
export function validateRemoteResult(result: OspResult): OspVerification {
  // 1. Structural validation: is this a well-formed OspResult?
  const isValid = validateResult(result)

  // 2. Check remote verification status
  const remoteVerificationPassed = result.verification.status === 'passed'

  // 3. Check all remote assertions have evidence
  const assertionsHaveEvidence = result.verification.assertions.every(
    (a) => a.result || a.evidence !== undefined
  )

  // 4. Re-verify expected effects locally
  const effectResults: Record<string, boolean> = {}
  for (const effect of result.action.expectedEffects) {
    const remoteAssertion = result.verification.assertions.find(
      (a) => a.effect === effect.description
    )
    // Only trust if remote provided both a passing result and evidence
    effectResults[effect.description] = remoteAssertion
      ? remoteAssertion.result && remoteAssertion.evidence !== undefined
      : false
  }

  const localVerification = verify(result.action.expectedEffects, effectResults)

  // If structural validation fails, override to failed
  if (!isValid) {
    return {
      ...localVerification,
      status: 'failed',
      assertions: [
        ...localVerification.assertions,
        { effect: 'Valid OspResult structure', result: false, evidence: 'validateResult() failed' },
      ],
    }
  }

  // If remote said passed but local disagrees, mark as partial
  if (remoteVerificationPassed && localVerification.status === 'failed') {
    return {
      ...localVerification,
      status: 'partial',
      escalation: {
        strategy: 'escalate',
        reason: 'Remote verification passed but local re-verification failed',
        target: 'supervisor',
      },
    }
  }

  return localVerification
}
