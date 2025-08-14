'use server';

import { actions } from '@syner/actions';

// Import to register workflows actions
import '@syner/workflows';

export async function startWorkflow(id: string, inputs?: Record<string, unknown>) {
  return await actions.run({
    action: 'workflows:start',
    params: { 
      id, 
      inputs 
    },
    metadata: {
      app: 'os',
      timestamp: Date.now()
    }
  });
}

export async function stopWorkflow(executionId: string) {
  return await actions.run({
    action: 'workflows:stop',
    params: { executionId },
    metadata: {
      app: 'os',
      timestamp: Date.now()
    }
  });
}

export async function listWorkflows(params?: {
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  limit?: number;
  offset?: number;
}) {
  return await actions.run({
    action: 'workflows:list',
    params: params || {},
    metadata: {
      app: 'os',
      timestamp: Date.now()
    }
  });
}
