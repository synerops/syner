import { action } from '@syner/actions';
import { startExecution } from '../lib/engine';
import { executionParamsSchema, type ExecutionParams } from '../types';
import { getWorkflow } from '../lib/registry';

export const startAction = action({
  id: 'workflows:start',
  description: 'Start a workflow execution',
  parameters: executionParamsSchema,
  execute: async (params: unknown) => {
    const validatedParams = executionParamsSchema.parse(params) as ExecutionParams;
    
    // Check if workflow exists
    const workflow = getWorkflow(validatedParams.id);
    if (!workflow) {
      throw new Error(`Workflow '${validatedParams.id}' not found`);
    }
    
    const result = await startExecution(validatedParams);
    return { 
      status: 'started', 
      executionId: result.executionId,
      workflowId: validatedParams.id
    };
  },
});
