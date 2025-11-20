import { z } from 'zod';

/**
 * Sandbox Protocol for Syner OS
 * 
 * This file defines the contract for sandbox execution.
 * The protocol is vendor-agnostic - implementations go in extensions.
 * 
 * @see https://github.com/synerops/protocol
 */

/**
 * Options for running a command within the sandbox.
 */
export interface RunCommandOptions {
  /**
   * Command to execute (e.g., "npm", "node", "ls")
   */
  cmd: string;
  
  /**
   * Arguments to pass to the command
   */
  args?: string[];
  
  /**
   * Whether to run the command as root (if supported)
   */
  sudo?: boolean;
  
  /**
   * Whether to run the command in detached mode
   */
  detached?: boolean;
  
  /**
   * Custom environment variables
   */
  env?: Record<string, string>;
}

/**
 * Result of executing a command within the sandbox.
 */
export interface RunCommandResult {
  /**
   * Exit code of the command
   */
  exitCode: number;
  
  /**
   * Standard output (if captured)
   */
  stdout?: string;
  
  /**
   * Standard error (if captured)
   */
  stderr?: string;
}

/**
 * Schema for sandbox options (vendor agnostic)
 */
export const SandboxOptionsSchema = z.object({
  /**
   * Source code to seed the sandbox with
   */
  source: z.object({
    /**
     * Git repository URL
     */
    url: z.string().url(),
    /**
     * Source type (currently only "git" is supported)
     */
    type: z.literal('git'),
  }).optional(),
  
  /**
   * Resource allocation for the sandbox
   */
  resources: z.object({
    /**
     * Number of virtual CPUs
     */
    vcpus: z.number().int().min(1).max(8).optional(),
  }).optional(),
  
  /**
   * Timeout in milliseconds
   */
  timeout: z.number().int().positive().optional(),
  
  /**
   * Ports to expose
   */
  ports: z.array(z.number().int().positive()).optional(),
  
  /**
   * Runtime environment
   */
  runtime: z.enum(['node22', 'python3.13']).optional(),
});

/**
 * Type representing sandbox options.
 */
export type SandboxOptions = z.infer<typeof SandboxOptionsSchema>;

/**
 * Sandbox Protocol interface.
 * All sandbox implementations must implement this interface.
 * 
 * @example
 * ```typescript
 * class MySandbox implements Sandbox {
 *   async runCommand(options: RunCommandOptions): Promise<RunCommandResult> {
 *     // Implementation
 *   }
 *   
 *   async destroy(): Promise<void> {
 *     // Cleanup
 *   }
 *   
 *   // ... other methods
 * }
 * ```
 */
export interface Sandbox {
  /**
   * Execute a command within the sandbox.
   * 
   * @param options - Command options
   * @returns Command execution result
   */
  runCommand(options: RunCommandOptions): Promise<RunCommandResult>;
  
  /**
   * Destroy the sandbox and clean up resources.
   * 
   * @returns Promise that resolves when cleanup is complete
   */
  destroy(): Promise<void>;
  
  /**
   * Edit a file within the sandbox.
   * 
   * @param path - Path to the file (relative to sandbox root)
   * @param content - New content for the file
   * @returns Promise that resolves when file is written
   */
  editFile(path: string, content: string): Promise<void>;
  
  /**
   * Read a file from within the sandbox.
   * 
   * @param path - Path to the file (relative to sandbox root)
   * @returns File content as string
   */
  readFile(path: string): Promise<string>;
  
  /**
   * List files in a directory within the sandbox.
   * 
   * @param path - Path to the directory (relative to sandbox root)
   * @returns Array of file paths
   */
  listFiles(path: string): Promise<string[]>;
  
  /**
   * Clone a git repository into the sandbox.
   * 
   * @param url - Git repository URL
   * @param targetPath - Optional target path (defaults to current directory)
   * @returns Promise that resolves when clone is complete
   */
  cloneRepo(url: string, targetPath?: string): Promise<void>;
  
  /**
   * Install dependencies using the specified package manager.
   * 
   * @param packageManager - Package manager to use (defaults to detecting from lock file)
   * @returns Promise that resolves when installation is complete
   */
  installDependencies(
    packageManager?: 'npm' | 'pnpm' | 'yarn'
  ): Promise<void>;
}

