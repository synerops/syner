export interface ContextSource {
  type: 'vault' | 'file' | 'api' | 'skill'
  ref: string
  summary?: string
}

export interface Context {
  agentId: string
  skillRef: string
  loaded: ContextSource[]
  missing: string[]
  timestamp: string
  parentContext?: string
}

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
