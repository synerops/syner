import { z } from 'zod';

/**
 * Configuration Protocol for Syner OS
 * 
 * This file defines the contract for agent configuration files (agents.json).
 * Schema and types defined here can be externalized to a separate protocol repo.
 * 
 * @see https://github.com/synerops/protocol
 */

/**
 * Schema for agents.json configuration file.
 * Defines the structure and validation rules for agent project configuration.
 * 
 * @example
 * ```json
 * {
 *   "$schema": "https://syner.dev/schema.json",
 *   "directory": "./agents",
 *   "patterns": ["*.agent.ts", "**\/*.agent.ts"],
 *   "exclude": ["**\/*.test.ts"]
 * }
 * ```
 */
export const ConfigSchema = z.object({
  /**
   * JSON Schema reference for IDE autocompletion
   */
  $schema: z.string().optional(),
  
  /**
   * Directory where agents are located (relative to config file)
   * @default "./agents"
   */
  directory: z.string().default('./agents'),
  
  /**
   * Glob patterns to match agent files
   * @default ["*.{ts,js}", "*\/*.{ts,js}"]
   */
  patterns: z
    .array(z.string())
    .optional()
    .default(['*.{ts,js}', '*/*.{ts,js}']),
  
  /**
   * Glob patterns to exclude from discovery
   * @default ["**\/*.test.*", "**\/*.spec.*"]
   */
  exclude: z
    .array(z.string())
    .optional()
    .default(['**/*.test.*', '**/*.spec.*']),
});

/**
 * Type representing a valid agent configuration.
 * Inferred from ConfigSchema for type safety.
 */
export type Config = z.infer<typeof ConfigSchema>;

/**
 * Configuration Protocol interface for extensibility.
 * Implement this interface to create custom config loaders.
 */
export interface ConfigProtocol {
  /**
   * Load configuration from a file
   * @param path - Path to configuration file
   * @returns Validated configuration object
   */
  load(path: string): Promise<Config>;
  
  /**
   * Resolve directory path from config
   * @param config - Configuration object
   * @returns Absolute path to configured directory
   */
  resolveDirectory(config: Config): string;
}

