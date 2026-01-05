import { resolve, join } from 'node:path';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

import type { Config, ConfigProtocol } from './protocol';
import { ConfigSchema } from './protocol';

/**
 * Default configuration file name
 */
export const DEFAULT_CONFIG_FILE = 'agents.json';

/**
 * Loads and validates configuration from the current working directory.
 * Does NOT search parent directories - config must be in CWD.
 * 
 * @param configFileName - Name of the config file (default: 'agents.json')
 * @param cwd - Current working directory (default: process.cwd())
 * @returns Parsed and validated configuration
 * @throws Error if config file not found or validation fails
 * 
 * @example
 * ```typescript
 * const config = await loadConfig();
 * console.log(config.directory); // "./agents"
 * ```
 */
export async function loadConfig(
  configFileName: string = DEFAULT_CONFIG_FILE,
  cwd: string = process.cwd()
): Promise<Config> {
  const configPath = join(cwd, configFileName);

  if (!existsSync(configPath)) {
    throw new Error(
      `${configFileName} not found in current directory.\n` +
      `  Run 'syner init' to create a new project.`
    );
  }

  const content = await readFile(configPath, 'utf-8');
  const json = JSON.parse(content);
  return ConfigSchema.parse(json);
}

/**
 * Resolves the configured directory path to an absolute path.
 * Returns an absolute path by resolving the configured directory relative to CWD.
 * 
 * @param config - The loaded configuration
 * @param cwd - Current working directory (default: process.cwd())
 * @returns Absolute path to configured directory
 * 
 * @example
 * ```typescript
 * const config = await loadConfig();
 * const agentsDir = resolveConfigDirectory(config);
 * console.log(agentsDir); // "/absolute/path/to/agents"
 * ```
 */
export function resolveConfigDirectory(
  config: Config,
  cwd: string = process.cwd()
): string {
  return resolve(cwd, config.directory);
}

/**
 * Creates a custom config loader implementing ConfigProtocol.
 * Useful for testing or custom config sources.
 * 
 * @example
 * ```typescript
 * const loader = createConfigLoader();
 * const config = await loader.load('custom-config.json');
 * const dir = loader.resolveDirectory(config);
 * ```
 */
export function createConfigLoader(cwd?: string): ConfigProtocol {
  return {
    load: (path: string) => loadConfig(path, cwd),
    resolveDirectory: (config: Config) => resolveConfigDirectory(config, cwd),
  };
}

// Re-export protocol types
export type { Config, ConfigProtocol } from './protocol';
export { ConfigSchema } from './protocol';

