/**
 * Sandbox Tools
 * 
 * Tools that use the Sandbox protocol for agent execution.
 * These tools are injected into the agent's toolset when sandbox is active.
 */

import type { ToolSet } from 'ai';
import type { Sandbox } from '../system/sandbox';

/**
 * Create sandbox tools that use a Sandbox instance.
 * 
 * These tools allow the agent to interact with the sandbox environment.
 * They are factories that receive a Sandbox instance and return configured tools.
 * 
 * @param sandbox - Sandbox instance to use
 * @returns ToolSet with sandbox-specific tools
 * 
 * @example
 * ```typescript
 * const sandbox = await createVercelSandbox(...)
 * const tools = createSandboxTools(sandbox)
 * // Use tools with agent
 * ```
 */
export function createSandboxTools(sandbox: Sandbox): ToolSet {
  return {
    editFile: {
      description: 'Edit a file within the sandbox. Creates the file if it does not exist.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Path to the file relative to sandbox root',
          },
          content: {
            type: 'string',
            description: 'Content to write to the file',
          },
        },
        required: ['path', 'content'],
      },
      execute: async ({ path, content }: { path: string; content: string }) => {
        await sandbox.editFile(path, content);
        return { success: true, message: `File ${path} edited successfully` };
      },
    },
    
    readFile: {
      description: 'Read a file from within the sandbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Path to the file relative to sandbox root',
          },
        },
        required: ['path'],
      },
      execute: async ({ path }: { path: string }) => {
        const content = await sandbox.readFile(path);
        return { content, path };
      },
    },
    
    listFiles: {
      description: 'List all files in a directory within the sandbox.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Path to the directory relative to sandbox root',
            default: '/vercel/sandbox',
          },
        },
        required: ['path'],
      },
      execute: async ({ path }: { path: string }) => {
        const files = await sandbox.listFiles(path);
        return { files, path, count: files.length };
      },
    },
    
    runCommand: {
      description: 'Execute a command within the sandbox.',
      parameters: {
        type: 'object',
        properties: {
          cmd: {
            type: 'string',
            description: 'Command to execute (e.g., "npm", "node", "ls")',
          },
          args: {
            type: 'array',
            items: { type: 'string' },
            description: 'Arguments to pass to the command',
            default: [],
          },
          sudo: {
            type: 'boolean',
            description: 'Run command as root (if supported)',
            default: false,
          },
        },
        required: ['cmd'],
      },
      execute: async ({
        cmd,
        args = [],
        sudo = false,
      }: {
        cmd: string;
        args?: string[];
        sudo?: boolean;
      }) => {
        const result = await sandbox.runCommand({
          cmd,
          args,
          sudo,
        });
        return {
          exitCode: result.exitCode,
          stdout: result.stdout,
          stderr: result.stderr,
        };
      },
    },
    
    installDependencies: {
      description: 'Install dependencies in the sandbox using the specified package manager.',
      parameters: {
        type: 'object',
        properties: {
          packageManager: {
            type: 'string',
            enum: ['npm', 'pnpm', 'yarn'],
            description: 'Package manager to use (defaults to auto-detection)',
          },
        },
      },
      execute: async ({
        packageManager,
      }: {
        packageManager?: 'npm' | 'pnpm' | 'yarn';
      } = {}) => {
        await sandbox.installDependencies(packageManager);
        return {
          success: true,
          message: `Dependencies installed using ${packageManager || 'auto-detected'} package manager`,
        };
      },
    },
  };
}

