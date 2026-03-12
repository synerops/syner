export interface Precondition {
  check: string
  met: boolean
  detail?: string
}

export interface Effect {
  description: string
  verifiable: boolean
}

export interface OspAction {
  description: string
  preconditions: Precondition[]
  expectedEffects: Effect[]
  rollbackStrategy?: 'revert' | 'escalate' | 'noop'
}

export function createAction(partial: Partial<OspAction> & Pick<OspAction, 'description'>): OspAction {
  return {
    preconditions: [],
    expectedEffects: [],
    ...partial,
  }
}

export function checkPreconditions(action: OspAction): { pass: boolean; unmet: Precondition[] } {
  const unmet = action.preconditions.filter((p) => !p.met)
  return { pass: unmet.length === 0, unmet }
}
