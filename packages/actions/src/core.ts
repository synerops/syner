import type { Action, ActionInput, ActionOutput } from './types.js';

// Global state
const actionsMap = new Map<string, Action[]>();

// Registry functions
export const registry = {
  register: (name: string, actions: Action[]) => {
    actionsMap.set(name, actions);
  },
  getApps: () => Array.from(actionsMap.keys()),
  getActions: (app: string) => actionsMap.get(app) || []
};

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
      
      const appActions = actionsMap.get(appName);
      if (!appActions) {
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
  
  list: () => Array.from(actionsMap.values()).flat().map(a => a.id)
};

// Helper function (minimal overhead)
export const action = (config: Omit<Action, 'execute'> & { execute: Action['execute'] }): Action => {
  return config as Action;
};

// Validation helpers (tree-shakeable)
export const validateActionId = (id: string): boolean => {
  return /^[a-z]+:[a-z]+$/.test(id);
};

export const parseActionId = (id: string): { namespace: string; verb: string } | null => {
  if (!validateActionId(id)) return null;
  const [namespace, verb] = id.split(':');
  return { namespace: namespace!, verb: verb! };
};
