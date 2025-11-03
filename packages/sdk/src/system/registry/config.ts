import { z } from 'zod';
import { resolve, join } from 'node:path';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

/**
 * Schema for agents.json configuration file.
 * Defines the structure and validation rules for agent project configuration.
 */
export const AgentsConfigSchema = z.object({
  $schema: z.string().optional(),
  directory: z.string().default('./agents'),
});

/**
 * Type representing a valid agents configuration.
 */
export type AgentsConfig = z.infer<typeof AgentsConfigSchema>;

/**
 * Loads and validates agents.json from the current working directory.
 * Does NOT search parent directories - config must be in CWD.
 * 
 * @param configFileName - Name of the config file (default: 'agents.json')
 * @param cwd - Current working directory (default: process.cwd())
 * @returns Parsed and validated configuration
 * @throws Error if config file not found or validation fails
 * 
 * @example
 * ```typescript
 * const config = await loadConfig('agents.json');
 * const agentsDir = resolve(process.cwd(), config.directory);
 * ```
 */
export async function loadConfig(
  configFileName: string,
  cwd: string = process.cwd()
): Promise<AgentsConfig> {
  const configPath = join(cwd, configFileName);

  if (!existsSync(configPath)) {
    throw new Error(
      `${configFileName} not found in current directory.\n  Run 'syner init' to create a new project.`
    );
  }

  const content = await readFile(configPath, 'utf-8');
  const json = JSON.parse(content);
  return AgentsConfigSchema.parse(json);
}

/**
 * Resolves the agents directory path from config.
 * Returns an absolute path by resolving the configured directory relative to CWD.
 * 
 * @param config - The loaded agents configuration
 * @param cwd - Current working directory (default: process.cwd())
 * @returns Absolute path to agents directory
 * 
 * @example
 * ```typescript
 * const config = await loadConfig('agents.json');
 * const agentsDir = resolveAgentsDirectory(config);
 * ```
 */
export function resolveAgentsDirectory(
  config: AgentsConfig,
  cwd: string = process.cwd()
): string {
  return resolve(cwd, config.directory);
}

