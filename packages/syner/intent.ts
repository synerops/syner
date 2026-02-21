// syner/packages/syner/intent.ts
// Intent classification schema for prompt routing

import { z } from 'zod'

// =============================================================================
// Primitive Types
// =============================================================================

export const IntentTypeSchema = z.enum([
  'direct',     // Simple response, no orchestration needed
  'execute',    // Execute a specific action
  'plan',       // Requires planning before execution
  'delegate',   // Delegate to specialized workflow/agent
  'clarify',    // Need more information from user
])
export type IntentType = z.infer<typeof IntentTypeSchema>

export const ComplexityLevelSchema = z.enum(['simple', 'moderate', 'complex'])
export type ComplexityLevel = z.infer<typeof ComplexityLevelSchema>

export const WorkflowTypeSchema = z.enum([
  'route',        // Classify and delegate to single handler
  'orchestrate',  // Plan, delegate to multiple workers, synthesize
  'parallelize',  // Split, parallel execute, merge
  'evaluate',     // Generate, evaluate, optimize loop
])
export type WorkflowType = z.infer<typeof WorkflowTypeSchema>

export const AgentTypeSchema = z.enum([
  'worker',       // Executes specific tasks
  'specialist',   // Domain expert
  'reviewer',     // Code review, quality checks
  'orchestrator', // Coordinates multiple agents
])
export type AgentType = z.infer<typeof AgentTypeSchema>

export const ActionTypeSchema = z.enum([
  'respond',  // Direct response, no workflow
  'execute',  // Execute action directly
  'plan',     // Enter planning mode
  'delegate', // Delegate to workflow
  'ask',      // Ask user for clarification
])
export type ActionType = z.infer<typeof ActionTypeSchema>

// =============================================================================
// Compound Schemas
// =============================================================================

export const IntentSchema = z.object({
  type: IntentTypeSchema,
  confidence: z.number().min(0).max(1).describe('Confidence score 0.0-1.0'),
  rationale: z.string().describe('Brief explanation of classification'),
})
export type Intent = z.infer<typeof IntentSchema>

export const ComplexitySchema = z.object({
  depth: z.number().int().min(1).max(5).describe('Sequential steps needed (1-5)'),
  width: z.number().int().min(1).max(5).describe('Specialties required (1-5)'),
  estimated: ComplexityLevelSchema,
})
export type Complexity = z.infer<typeof ComplexitySchema>

// Renamed from Routing to Strategy
export const StrategySchema = z.object({
  requires_planning: z.boolean().describe('Whether task needs planning phase'),
  suggested_workflow: WorkflowTypeSchema.nullable().describe('Recommended workflow pattern'),
  suggested_agent: AgentTypeSchema.nullable().describe('Recommended agent type'),
})
export type Strategy = z.infer<typeof StrategySchema>

export const NextActionSchema = z.object({
  action: ActionTypeSchema,
  details: z.string().describe('Specific instructions for the action'),
})
export type NextAction = z.infer<typeof NextActionSchema>

// =============================================================================
// Main Classification Schema
// =============================================================================

export const IntentClassificationSchema = z.object({
  intent: IntentSchema,
  complexity: ComplexitySchema,
  strategy: StrategySchema,
  next_action: NextActionSchema,
})
export type IntentClassification = z.infer<typeof IntentClassificationSchema>
