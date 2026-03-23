import { z } from 'zod'

// --- Context ---

export const ContextSourceSchema = z.object({
  type: z.enum(['vault', 'file', 'api', 'skill']),
  ref: z.string(),
  summary: z.string().optional(),
})

export const ContextSchema = z.object({
  agentId: z.string(),
  skillRef: z.string(),
  loaded: z.array(ContextSourceSchema),
  missing: z.array(z.string()),
  timestamp: z.string(),
  parentContext: z.string().optional(),
})

// --- Action ---

export const PreconditionSchema = z.object({
  check: z.string(),
  met: z.boolean(),
  detail: z.string().optional(),
})

export const EffectSchema = z.object({
  description: z.string(),
  verifiable: z.boolean(),
})

export const ActionSchema = z.object({
  description: z.string(),
  preconditions: z.array(PreconditionSchema),
  expectedEffects: z.array(EffectSchema),
  rollbackStrategy: z.enum(['revert', 'escalate', 'noop']).optional(),
})

// --- Verification ---

export const AssertionSchema = z.object({
  effect: z.string(),
  result: z.boolean(),
  evidence: z.string().optional(),
})

export const EscalationSchema = z.object({
  strategy: z.enum(['rollback', 'escalate', 'retry']),
  target: z.string().optional(),
  reason: z.string(),
})

export const VerificationSchema = z.object({
  status: z.enum(['passed', 'failed', 'partial']),
  assertions: z.array(AssertionSchema),
  escalation: EscalationSchema.optional(),
})

// --- Result ---

export const ResultSchema = z.object({
  context: ContextSchema,
  action: ActionSchema,
  verification: VerificationSchema,
  output: z.unknown().optional(),
  duration: z.number(),
  chain: z.string().optional(),
})

// --- Skill ---

export const SkillSchema = z.object({
  name: z.string(),
  description: z.string(),
  license: z.string().optional(),
  compatibility: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
})

// --- Run ---

export const RunStatusSchema = z.enum([
  'pending', 'in-progress', 'awaiting',
  'completed', 'failed', 'cancelled',
])

export const RunActivitySchema = z.enum(['idle', 'executing', 'waiting', 'thinking'])

export const ProgressSchema = z.object({
  current: z.number(),
  label: z.string().optional(),
})

export const TimeoutSchema = z.object({
  duration: z.number(),
  strategy: z.enum(['fail', 'cancel', 'continue']),
})

export const RetrySchema = z.object({
  maxAttempts: z.number(),
  delay: z.number(),
  backoff: z.enum(['linear', 'exponential']).optional(),
  maxDelayMs: z.number().optional(),
})

export const ApprovalSchema = z.object({
  approved: z.boolean(),
  reason: z.string().optional(),
  approvedBy: z.string().optional(),
  timestamp: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const CancelSchema = z.object({
  reason: z.string().optional(),
  graceful: z.boolean().optional(),
  gracefulTimeoutMs: z.number().optional(),
  allowVeto: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const RunSchema = z.object({
  id: z.string(),
  status: RunStatusSchema,
  results: z.array(ResultSchema),
  progress: ProgressSchema.optional(),
  approval: ApprovalSchema.optional(),
  timeout: TimeoutSchema.optional(),
  retry: RetrySchema.optional(),
  cancel: CancelSchema.optional(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  chain: z.string().optional(),
  activity: RunActivitySchema.optional(),
  lastHeartbeat: z.string().optional(),
})

// --- Inferred types ---

export type ContextSource = z.infer<typeof ContextSourceSchema>
export type Context = z.infer<typeof ContextSchema>
export type Precondition = z.infer<typeof PreconditionSchema>
export type Effect = z.infer<typeof EffectSchema>
export type Action = z.infer<typeof ActionSchema>
export type Assertion = z.infer<typeof AssertionSchema>
export type Escalation = z.infer<typeof EscalationSchema>
export type Verification = z.infer<typeof VerificationSchema>
export type Result<T = unknown> = Omit<z.infer<typeof ResultSchema>, 'output'> & { output?: T }
export type Skill = z.infer<typeof SkillSchema>
export type Progress = z.infer<typeof ProgressSchema>
export type Timeout = z.infer<typeof TimeoutSchema>
export type Retry = z.infer<typeof RetrySchema>
export type Approval = z.infer<typeof ApprovalSchema>
export type Cancel = z.infer<typeof CancelSchema>
export type RunStatus = z.infer<typeof RunStatusSchema>
export type RunActivity = z.infer<typeof RunActivitySchema>
export type Run<T = unknown> = Omit<z.infer<typeof RunSchema>, 'results'> & { results: Result<T>[] }
