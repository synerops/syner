/**
 * Vercel Sandbox Implementation
 * 
 * Implements the Sandbox protocol using Vercel Sandbox.
 */

import { Sandbox as VercelSandboxType } from '@vercel/sandbox';
import { Sandbox } from '@vercel/sandbox';
import { Writable } from 'stream';
import type {
  Sandbox as SandboxProtocol,
  SandboxOptions,
  RunCommandOptions,
  RunCommandResult,
} from '@syner/sdk';

/**
 * Options for creating a Vercel Sandbox.
 * Extends the vendor-agnostic SandboxOptions with Vercel-specific fields.
 */
export interface VercelSandboxOptions extends SandboxOptions {
  /**
   * Team ID (required if using access token)
   */
  teamId?: string;
  
  /**
   * Project ID (required if using access token)
   */
  projectId?: string;
  
  /**
   * Access token (alternative to OIDC token)
   */
  token?: string;
}

/**
 * Vercel Sandbox implementation of the Sandbox protocol.
 */
export class VercelSandbox implements SandboxProtocol {
  private sandbox: VercelSandboxType;
  private basePath: string = '/vercel/sandbox';

  constructor(sandbox: VercelSandboxType) {
    this.sandbox = sandbox;
  }

  /**
   * Execute a command within the sandbox.
   */
  async runCommand(options: RunCommandOptions): Promise<RunCommandResult> {
    // Capture stdout and stderr if not streaming
    let stdoutBuffer = '';
    let stderrBuffer = '';
    
    const stdoutStream = options.detached 
      ? process.stdout 
      : new Writable({
          write(chunk, encoding, callback) {
            stdoutBuffer += chunk.toString();
            callback();
          },
        });
    
    const stderrStream = options.detached
      ? process.stderr
      : new Writable({
          write(chunk, encoding, callback) {
            stderrBuffer += chunk.toString();
            callback();
          },
        });

    const result = await this.sandbox.runCommand({
      cmd: options.cmd,
      args: options.args || [],
      sudo: options.sudo,
      detached: options.detached,
      env: options.env,
      stdout: stdoutStream,
      stderr: stderrStream,
    });

    return {
      exitCode: result.exitCode || 0,
      stdout: options.detached ? undefined : stdoutBuffer,
      stderr: options.detached ? undefined : stderrBuffer,
    };
  }

  /**
   * Destroy the sandbox and clean up resources.
   */
  async destroy(): Promise<void> {
    // Vercel Sandbox cleanup is handled automatically
    // If there's an explicit destroy method, call it here
    if (typeof this.sandbox.destroy === 'function') {
      await this.sandbox.destroy();
    }
  }

  /**
   * Edit a file within the sandbox.
   */
  async editFile(path: string, content: string): Promise<void> {
    const fullPath = path.startsWith('/') ? path : `${this.basePath}/${path}`;
    
    // Create a temporary script file with the content and then move it
    // This handles special characters, newlines, and content safely
    const tempFile = `/tmp/${Date.now()}-content.txt`;
    
    // Use echo with here-document or base64 encoding for safety
    // Base64 encode content to avoid shell escaping issues
    const encodedContent = Buffer.from(content, 'utf-8').toString('base64');
    
    // Write content using base64 decode
    const result = await this.runCommand({
      cmd: 'sh',
      args: ['-c', `echo ${encodedContent} | base64 -d > ${fullPath}`],
    });

    if (result.exitCode !== 0) {
      throw new Error(`Failed to edit file: ${path} - ${result.stderr || 'Unknown error'}`);
    }
  }

  /**
   * Read a file from within the sandbox.
   */
  async readFile(path: string): Promise<string> {
    const fullPath = path.startsWith('/') ? path : `${this.basePath}/${path}`;
    
    const result = await this.runCommand({
      cmd: 'cat',
      args: [fullPath],
    });

    if (result.exitCode !== 0) {
      throw new Error(`Failed to read file: ${path}`);
    }

    if (!result.stdout) {
      throw new Error(`No output from read file command: ${path}`);
    }

    return result.stdout;
  }

  /**
   * List files in a directory within the sandbox.
   */
  async listFiles(path: string): Promise<string[]> {
    const fullPath = path.startsWith('/') ? path : `${this.basePath}/${path}`;
    
    const result = await this.runCommand({
      cmd: 'find',
      args: [fullPath, '-type', 'f'],
    });

    if (result.exitCode !== 0 || !result.stdout) {
      return [];
    }

    // Split by newlines and filter empty strings
    return result.stdout
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  /**
   * Clone a git repository into the sandbox.
   */
  async cloneRepo(url: string, targetPath?: string): Promise<void> {
    const target = targetPath || this.basePath;
    
    await this.runCommand({
      cmd: 'git',
      args: ['clone', url, target],
    });
  }

  /**
   * Install dependencies using the specified package manager.
   */
  async installDependencies(
    packageManager?: 'npm' | 'pnpm' | 'yarn'
  ): Promise<void> {
    // Detect package manager from lock file if not specified
    let pm = packageManager;
    
    if (!pm) {
      // Check for lock files
      // This would require reading files, which we'll implement properly later
      pm = 'npm'; // Default
    }

    const cmd = pm === 'pnpm' ? 'pnpm' : pm === 'yarn' ? 'yarn' : 'npm';
    
    await this.runCommand({
      cmd,
      args: ['install'],
    });
  }
}

/**
 * Create a Vercel Sandbox instance.
 * 
 * @param options - Sandbox options (Vercel-specific)
 * @returns Promise that resolves to a Sandbox implementation
 */
export async function createVercelSandbox(
  options?: VercelSandboxOptions
): Promise<SandboxProtocol> {
  // Build Vercel Sandbox options
  const vercelOptions: Parameters<typeof Sandbox.create>[0] = {
    source: options?.source,
    resources: options?.resources,
    timeout: options?.timeout,
    ports: options?.ports,
    runtime: options?.runtime || 'node22',
  };

  // Add authentication if provided
  if (options?.teamId && options?.projectId && options?.token) {
    vercelOptions.teamId = options.teamId;
    vercelOptions.projectId = options.projectId;
    vercelOptions.token = options.token;
  }
  // Otherwise, Vercel Sandbox will use OIDC token from environment

  const sandbox = await Sandbox.create(vercelOptions);
  
  return new VercelSandbox(sandbox);
}

