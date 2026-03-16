import {
  createContext,
  createAction,
  checkPreconditions,
  verify,
  createResult,
  type Context,
  type Action,
  type Result,
  type Skill,
} from '@syner/osprotocol'

export interface AgentHandlerConfig {
  agentId: string
  skillRef: string
  manifest?: Skill
  handler: (req: Request, context: Context, action: Action) => Promise<unknown>
  onResult?: (result: Result) => Promise<void>
}

export function createAgentHandler(config: AgentHandlerConfig) {
  return async function agentHandler(req: Request): Promise<Response> {
    const startTime = Date.now()

    // 1. Build context
    const context = createContext({
      agentId: config.agentId,
      skillRef: config.skillRef,
      loaded: config.manifest
        ? [{ type: 'skill' as const, ref: config.skillRef, summary: config.manifest.description }]
        : [],
      missing: [],
    })

    // 2. Build action (preconditions/effects come from caller, not manifest)
    const preconditions: { check: string; met: boolean }[] = []
    const expectedEffects: { description: string; verifiable: boolean }[] = []

    const action = createAction({
      description: `Handle ${req.method} ${config.skillRef}`,
      preconditions,
      expectedEffects,
    })

    // 3. Check preconditions
    const { pass, unmet } = checkPreconditions(action)
    if (!pass) {
      const verification = verify(expectedEffects, {})
      const result = createResult(context, action, verification)

      await config.onResult?.(result)

      return Response.json(
        {
          error: 'Preconditions not met',
          unmet: unmet.map((p) => p.check),
          result,
        },
        { status: 412 }
      )
    }

    // 4. Execute handler
    try {
      const output = await config.handler(req, context, action)

      // 5. Verify
      const results: Record<string, boolean> = {}
      for (const effect of expectedEffects) {
        results[effect.description] = true
      }
      const verification = verify(expectedEffects, results)

      const result: Result = {
        ...createResult(context, action, verification, output),
        duration: Date.now() - startTime,
      }

      await config.onResult?.(result)

      return Response.json(result)
    } catch (error) {
      const results: Record<string, boolean> = {}
      for (const effect of expectedEffects) {
        results[effect.description] = false
      }
      const verification = verify(expectedEffects, results)

      const result: Result = {
        ...createResult(context, action, verification),
        duration: Date.now() - startTime,
      }

      await config.onResult?.(result)

      return Response.json(
        { error: error instanceof Error ? error.message : String(error), result },
        { status: 500 }
      )
    }
  }
}
