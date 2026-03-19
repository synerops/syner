export type { Precondition, Effect, Action } from '../schemas'

import type { Action, Precondition } from '../schemas'

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
