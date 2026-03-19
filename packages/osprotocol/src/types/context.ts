export type { ContextSource, Context } from '../schemas'

import type { Context } from '../schemas'

export function createContext(
  partial: Partial<Context> & Pick<Context, 'agentId' | 'skillRef'>
): Context {
  return {
    loaded: [],
    missing: [],
    timestamp: new Date().toISOString(),
    ...partial,
  }
}
