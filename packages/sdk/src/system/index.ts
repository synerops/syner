export type System = Record<string, unknown>;

// Config API (agents.json)
export {
  loadConfig,
  resolveConfigDirectory,
  createConfigLoader,
  DEFAULT_CONFIG_FILE,
  ConfigSchema,
  type Config,
  type ConfigProtocol,
} from './agents.json';

// Registry API
export {
  AgentRegistry,
  AgentSchema,
  Registry,
  type Agent,
  type Discoverable,
} from './registry';

// Sandbox API
export {
  SandboxOptionsSchema,
  type Sandbox,
  type SandboxOptions,
  type RunCommandOptions,
  type RunCommandResult,
} from './sandbox';
