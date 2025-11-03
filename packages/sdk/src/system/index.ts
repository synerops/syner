export type System = Record<string, unknown>;

export type {
  Agent,
  AgentsConfig,
} from "./registry"

export {
  AgentRegistry,
  AgentSchema,
  Registry,
  AgentsConfigSchema,
  loadConfig,
  resolveAgentsDirectory,
} from './registry';
