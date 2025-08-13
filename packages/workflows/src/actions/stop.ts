import { action } from '@syner/actions';
import { stopExecution } from '../lib/engine';
import { stopParamsSchema, type StopParams } from '../types';

export const stopAction = action({
  id: 'workflows:stop',
  description: 'Stop a workflow execution',
  parameters: stopParamsSchema,
  execute: async (params: unknown) => {
    const validatedParams = stopParamsSchema.parse(params) as StopParams;
    const result = await stopExecution(validatedParams);
    return { 
      status: 'stopped', 
      executionId: result.executionId,
      finalStatus: result.status
    };
  },
});
