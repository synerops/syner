import { registry } from '@syner/actions';
import * as actions from './actions';

// Register all workflow actions with the global registry
registry.register('workflows', Object.values(actions));

// Re-export types for external use
export * from './types';
