'use server';

import { actions } from '@syner/actions';

export async function executeAction(action: string, params?: Record<string, unknown>) {
  return await actions.run({
    action,
    params,
    metadata: {
      app: 'os',
      timestamp: Date.now()
    }
  });
}
