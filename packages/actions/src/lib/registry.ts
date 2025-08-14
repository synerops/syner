import type { Action } from '../types';

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
