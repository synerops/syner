/** Scope determines how much context to load */
export type ContextScope = 'none' | 'targeted' | 'app' | 'full'

/** Input to resolveContext() */
export interface ContextRequest {
  scope: ContextScope
  /** Required when scope = 'app' */
  app?: string
  /** Required when scope = 'targeted' */
  query?: string
}

/** Output of resolveContext() — the assembled brief */
export interface Brief {
  /** Concatenated vault content, ready for system prompt injection */
  content: string
  /** Source file paths that were loaded */
  sources: string[]
  /** Scope that was actually resolved */
  scope: ContextScope
  /** Topics that were requested but not found */
  gaps: string[]
}
