export interface ContextSource {
  type: 'vault' | 'file' | 'api' | 'skill'
  ref: string
  summary?: string
}

export interface OspContext {
  agentId: string
  skillRef: string
  loaded: ContextSource[]
  missing: string[]
  timestamp: string
  parentContext?: string
}

export function createContext(
  partial: Partial<OspContext> & Pick<OspContext, 'agentId' | 'skillRef'>
): OspContext {
  return {
    loaded: [],
    missing: [],
    timestamp: new Date().toISOString(),
    ...partial,
  }
}
