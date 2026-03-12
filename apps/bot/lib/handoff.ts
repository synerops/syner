import {
  createContext,
  createAction,
  verify,
  createResult,
  escalate,
  type OspResult,
} from '@syner/osprotocol'
import { randomUUID } from 'crypto'

export interface HandoffStep {
  name: string
  description: string
  execute: () => Promise<unknown>
  effects: string[]
}

export async function executeChain(steps: HandoffStep[]): Promise<OspResult[]> {
  const chainId = randomUUID()
  const results: OspResult[] = []

  for (const step of steps) {
    const startTime = Date.now()

    const context = createContext({
      agentId: step.name,
      skillRef: `chain:${step.name}`,
      loaded: [],
      missing: [],
      parentContext: results.length > 0 ? chainId : undefined,
    })

    const expectedEffects = step.effects.map((desc) => ({
      description: desc,
      verifiable: true,
    }))

    const action = createAction({
      description: step.description,
      expectedEffects,
    })

    try {
      const output = await step.execute()

      const effectResults: Record<string, boolean> = {}
      for (const effect of step.effects) {
        effectResults[effect] = true
      }
      const verification = verify(expectedEffects, effectResults)

      const result: OspResult = {
        ...createResult(context, action, verification, output),
        duration: Date.now() - startTime,
        chain: chainId,
      }

      results.push(result)

      if (verification.status === 'failed') {
        // Escalate and break chain
        result.verification.escalation = escalate(verification, 'caller')
        break
      }
    } catch (error) {
      const effectResults: Record<string, boolean> = {}
      for (const effect of step.effects) {
        effectResults[effect] = false
      }
      const verification = verify(expectedEffects, effectResults)
      verification.escalation = escalate(verification, 'caller')

      const result: OspResult = {
        ...createResult(context, action, verification),
        duration: Date.now() - startTime,
        chain: chainId,
      }

      results.push(result)
      break // Chain breaks on failure
    }
  }

  return results
}
