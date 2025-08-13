import { z } from 'zod';

// Workflow execution status
export const ExecutionStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export type ExecutionStatus = typeof ExecutionStatus[keyof typeof ExecutionStatus];

// Workflow trigger types
export const TriggerType = {
  MANUAL: 'manual',
  SCHEDULED: 'scheduled',
  WEBHOOK: 'webhook',
} as const;

export type TriggerType = typeof TriggerType[keyof typeof TriggerType];

// Workflow execution result
export type ExecutionResult = {
  executionId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  output?: Record<string, unknown>;
};

// Workflow definition
export type Workflow = {
  id: string;
  name: string;
  description?: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
};

// Zod schemas for validation
export const executionParamsSchema = z.object({
  id: z.string(),
  trigger: z.enum(['manual', 'scheduled', 'webhook']),
  variables: z.record(z.string(), z.unknown()).optional(),
});

export const stopParamsSchema = z.object({
  executionId: z.string(),
});

export const listParamsSchema = z.object({
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

export type ExecutionParams = z.infer<typeof executionParamsSchema>;
export type StopParams = z.infer<typeof stopParamsSchema>;
export type ListParams = z.infer<typeof listParamsSchema>;
