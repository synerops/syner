// syner/packages/syner/intent.ts

export type IntentType = 'direct' | 'execute' | 'plan' | 'delegate' | 'clarify'
export type ComplexityLevel = 'simple' | 'moderate' | 'complex'
export type WorkflowType = 'route' | 'orchestrate' | 'parallelize' | 'evaluate'
export type AgentType = 'worker' | 'specialist' | 'reviewer' | 'orchestrator'
export type ActionType = 'respond' | 'execute' | 'plan' | 'delegate' | 'ask'

export interface Intent {
  type: IntentType
  confidence: number // 0.0 - 1.0
  rationale: string
}

export interface Complexity {
  depth: number // 1-5: sequential steps
  width: number // 1-5: required specialties
  estimated: ComplexityLevel
}

export interface Routing {
  requires_planning: boolean
  suggested_workflow: WorkflowType | null
  suggested_agent: AgentType | null
}

export interface NextAction {
  action: ActionType
  details: string
}

export interface IntentClassification {
  intent: Intent
  complexity: Complexity
  routing: Routing
  next_action: NextAction
}
