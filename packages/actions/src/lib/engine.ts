import type { ActionInput, ActionOutput } from '../types';
import { registry } from './registry';

// Actions system
export const actions = {
  run: async (input: ActionInput): Promise<ActionOutput> => {
    const startTime = Date.now();
    
    try {
      const parts = input.action.split(':');
      if (parts.length !== 2) {
        throw new Error(`Invalid action format: ${input.action}. Expected "namespace:verb"`);
      }
      
      const appName = parts[0];
      if (!appName) {
        throw new Error(`Invalid action format: ${input.action}. Expected "namespace:verb"`);
      }
      
      const appActions = registry.getActions(appName);
      if (!appActions.length) {
        throw new Error(`App '${appName}' not found`);
      }
      
      const action = appActions.find(a => a.id === input.action);
      if (!action) {
        throw new Error(`Action '${input.action}' not found`);
      }
      
      const result = await action.execute(input.params);
      
      return {
        success: true,
        data: result,
        metadata: { executionTime: Date.now() - startTime, timestamp: Date.now() }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { executionTime: Date.now() - startTime, timestamp: Date.now() }
      };
    }
  },
  
  list: () => {
    const allActions = Array.from(registry.getApps()).flatMap(app => registry.getActions(app));
    return allActions.map(a => a.id);
  }
};
