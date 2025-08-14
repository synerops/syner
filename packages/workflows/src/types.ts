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



// Step types for workflows
export type ActionStep = {
  id: string;
  action: string;
  inputs?: Record<string, unknown>;
};

export type WaitStep = {
  id: string;
  wait: number; // milliseconds
};

export type ParallelStep = {
  id: string;
  parallel: Step[];
};

export type ChoiceStep = {
  id: string;
  choice: {
    condition: boolean;
    ifTrue: Step;
    ifFalse: Step;
  };
};

export type Step = ActionStep | WaitStep | ParallelStep | ChoiceStep;

// Workflow type (consistent with @syner/actions Action type)
export type Workflow = {
  id: string;
  description: string;
  steps: Step[];
  inputs?: z.ZodSchema;
  outputs?: z.ZodSchema;
};

// Zod schemas for validation
export const executionParamsSchema = z.object({
  id: z.string(),
  inputs: z.record(z.string(), z.unknown()).optional(),
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
