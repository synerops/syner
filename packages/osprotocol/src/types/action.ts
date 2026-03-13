export interface Precondition {
  check: string
  met: boolean
  detail?: string
}

export interface Effect {
  description: string
  verifiable: boolean
}

export interface Action {
  description: string
  preconditions: Precondition[]
  expectedEffects: Effect[]
  rollbackStrategy?: 'revert' | 'escalate' | 'noop'
}

/** @deprecated Use Action instead */
export type OspAction = Action

export function createAction(partial: Partial<Action> & Pick<Action, 'description'>): Action {
  return {
    preconditions: [],
    expectedEffects: [],
    ...partial,
  }
}

export function checkPreconditions(action: Action): { pass: boolean; unmet: Precondition[] } {
  const unmet = action.preconditions.filter((p) => !p.met)
  return { pass: unmet.length === 0, unmet }
}
