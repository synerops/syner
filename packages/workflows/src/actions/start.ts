import { action } from '@syner/actions';
import { startExecution } from '../lib/engine';
import { executionParamsSchema, type ExecutionParams } from '../types';

export const startAction = action({
  id: 'workflows:start',
  description: 'Start a workflow execution',
  parameters: executionParamsSchema,
  execute: async (params: unknown) => {
    const validatedParams = executionParamsSchema.parse(params) as ExecutionParams;
    const result = await startExecution(validatedParams);
    return { 
      status: 'started', 
      executionId: result.executionId,
      workflowId: validatedParams.id
    };
  },
});
