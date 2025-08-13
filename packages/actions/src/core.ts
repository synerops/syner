import type { Action, ActionInput, ActionOutput } from './types.js';

// Global state (singleton pattern for performance)
const actionsMap = new Map<string, Action[]>();

// Registry functions (no classes = no overhead)
export const registry = {
  register: (name: string, actions: Action[]) => {
    actionsMap.set(name, actions);
  },
  getApps: () => Array.from(actionsMap.keys()),
  getActions: (app: string) => actionsMap.get(app) || []
};

// Actions system (no classes = no overhead)
export const actions = {
  run: async (input: ActionInput): Promise<ActionOutput> => {
    const startTime = Date.now();
    
    try {
      const parts = input.action.split(':');
      if (parts.length !== 2) {
        return {
          success: false,
          error: `Invalid action format: ${input.action}. Expected "namespace:verb"`,
          metadata: { executionTime: Date.now() - startTime, timestamp: Date.now() }
        };
      }
      
      const appName = parts[0]!;
      const appActions = actionsMap.get(appName);
      
      if (!appActions) {
        return {
          success: false,
          error: `App '${appName}' not found`,
          metadata: { executionTime: Date.now() - startTime, timestamp: Date.now() }
        };
      }
      
      const action = appActions.find(a => a.id === input.action);
      if (!action) {
        return {
          success: false,
          error: `Action '${input.action}' not found`,
          metadata: { executionTime: Date.now() - startTime, timestamp: Date.now() }
        };
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
