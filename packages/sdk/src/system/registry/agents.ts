import { resolve } from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { glob, promises } from 'node:fs';

import { z } from 'zod';

import type { Discoverable } from './protocol';
import { Registry } from './protocol';

/**
 * Agent schema definition using Zod for runtime validation.
 */
export const AgentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  description: z.string().optional(),
  capabilities: z.array(z.string()).optional(),
});

/**
 * Agent type inferred from the schema.
 */
export type Agent = z.infer<typeof AgentSchema>;

/**
 * Registry for discovering and managing agents.
 * Implements convention-first discovery from filesystem.
 */
export class AgentRegistry
  extends Registry<Agent>
  implements Discoverable<Agent> {
  private paths = new Map<string, string>();

  /**
   * Discovers agents from a specified directory path.
   * Scans for .ts and .js files using glob patterns, imports them, and validates their exports.
   *
   * @param dirPath - The directory path to scan for agent files
   * @param options - Optional configuration for discovery
   * @param options.patterns - Glob patterns to match agent files (default: ['*.{ts,js}', '*\/*.{ts,js}'])
   * @param options.exclude - Patterns to exclude (default: ['**\/*.test.*', '**\/*.spec.*'])
   * @returns Array of discovered and validated agents
   * @throws Error if directory doesn't exist or validation fails
   */
  async discover(
    dirPath: string,
    options?: { patterns?: string[]; exclude?: string[] }
  ): Promise<Agent[]> {
    // Check if directory exists
    if (!existsSync(dirPath)) {
      throw new Error(
        `Agents directory '${dirPath}' not found. Create it to add your first agent.`
      );
    }

    if (!statSync(dirPath).isDirectory()) {
      throw new Error(`Path '${dirPath}' is not a directory.`);
    }

    // Use provided patterns or defaults (flat + 1 level deep)
    const patterns = options?.patterns || ['*.{ts,js}', '*/*.{ts,js}'];
    const exclude = options?.exclude || ['**/*.test.*', '**/*.spec.*'];

    // Use fs.glob for pattern matching with exclusions
    const files = promises.glob(patterns, {
      cwd: dirPath,
      exclude,
    });

    const agents: Agent[] = [];

    for await (const file of files) {
      const filePath = resolve(dirPath, file);

      try {
        // Dynamic import
        const module = await import(filePath);

        // Extract named exports
        const rawAgent = {
          name: module.name,
          description: module.description,
          capabilities: module.capabilities,
        };

        // Validate with schema
        const validAgent = AgentSchema.parse(rawAgent);

        // Check for duplicates
        if (this.paths.has(validAgent.name)) {
          const existingPath = this.paths.get(validAgent.name);
          throw new Error(
            `Duplicate agent name '${validAgent.name}' found in ${existingPath} and ${filePath}`
          );
        }

        // Store agent
        this.set(validAgent.name, validAgent);
        this.paths.set(validAgent.name, filePath);
        agents.push(validAgent);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(
            `Agent file '${filePath}' validation failed: ${error.message}`
          );
        }
        throw error;
      }
    }

    return agents;
  }

  /**
   * Manually registers an agent.
   *
   * @param agent - The agent to register
   * @throws Error if agent with same name already exists
   */
  register(agent: Agent): void {
    if (this.has(agent.name)) {
      throw new Error(`Agent "${agent.name}" already registered`);
    }
    this.set(agent.name, agent);
  }
}
