import { action } from '@syner/actions';
import { listExecutions } from '../lib/engine';
import { listParamsSchema, type ListParams } from '../types';

export const listAction = action({
  id: 'workflows:list',
  description: 'List workflow executions',
  parameters: listParamsSchema,
  execute: async (params: unknown) => {
    const validatedParams = listParamsSchema.parse(params) as ListParams;
    const result = await listExecutions(validatedParams);
    return { 
      executions: result.executions,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        hasMore: result.offset + result.limit < result.total
      }
    };
  },
});
