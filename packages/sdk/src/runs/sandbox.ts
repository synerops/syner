/**
 * Sandbox Run Execution
 * 
 * Executes agent logic within a sandbox environment.
 */

import type {
  Sandbox,
  SandboxOptions,
} from '@syner/sdk';
import type { GenerateTextResult } from 'ai';
import type { Context } from '../context';

/**
 * Options for running agent logic in a sandbox.
 */
export interface RunOptions {
  /**
   * Task description or prompt
   */
  task: string;
  
  /**
   * Whether to run in a sandbox
   */
  inSandbox: boolean;
  
  /**
   * Git repository URL to clone into sandbox (if inSandbox is true)
   */
  project?: {
    url: string;
  };
  
  /**
   * Context for the agent
   */
  context?: Context;
  
  /**
   * Sandbox options (if inSandbox is true)
   */
  sandboxOptions?: SandboxOptions;
  
  /**
   * Sandbox instance (if already created)
   * If not provided and inSandbox is true, a sandbox must be created using an extension
   */
  sandbox?: Sandbox;
}

/**
 * Result of executing a run.
 */
export interface RunResult {
  /**
   * Generated result from the agent
   */
  result: GenerateTextResult<unknown, unknown>;
  
  /**
   * Sandbox instance that was used (if inSandbox was true)
   */
  sandbox?: Sandbox;
}

/**
 * Execute agent logic within a sandbox.
 * 
 * This is the main entry point for running agent logic in an isolated environment.
 * 
 * @param options - Run options
 * @returns Promise that resolves to the run result
 * @throws Error if sandbox is required but not provided
 * 
 * @example
 * ```typescript
 * import { createVercelSandbox } from "@syner/vercel"
 * import { run } from "@syner/sdk"
 * 
 * const sandbox = await createVercelSandbox({ runtime: "node22" })
 * const result = await run({
 *   task: "Change hero of landing page",
 *   inSandbox: true,
 *   project: { url: "https://github.com/user/repo.git" },
 *   sandbox
 * })
 * ```
 */
export async function run(options: RunOptions): Promise<RunResult> {
  const { task, inSandbox, project, sandbox, sandboxOptions } = options;
  
  if (inSandbox && !sandbox) {
    throw new Error(
      'Sandbox is required when inSandbox is true. ' +
      'Create a sandbox using an extension (e.g., @syner/vercel) and pass it in the sandbox option.'
    );
  }
  
  let activeSandbox = sandbox;
  
  try {
    // Setup project in sandbox if provided
    if (inSandbox && activeSandbox && project?.url) {
      await activeSandbox.cloneRepo(project.url);
      
      // Try to install dependencies if package.json exists
      try {
        await activeSandbox.installDependencies();
      } catch (error) {
        // Ignore if package.json doesn't exist or installation fails
        // This is not critical for the run
      }
    }
    
    // TODO: Execute agent loop (context → actions → checks)
    // This will be implemented as part of the agent execution logic
    // For now, we return a placeholder result
    const result: GenerateTextResult<unknown, unknown> = {
      text: `Task executed: ${task}`,
      warnings: [],
      request: {} as any,
      response: {} as any,
      experimental_providerMetadata: undefined,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
      finishReason: 'stop',
    };
    
    return {
      result,
      sandbox: inSandbox ? activeSandbox : undefined,
    };
  } catch (error) {
    // Ensure cleanup even on error
    if (inSandbox && activeSandbox) {
      try {
        await activeSandbox.destroy();
      } catch (cleanupError) {
        // Log but don't throw - we want the original error
        console.error('Failed to cleanup sandbox:', cleanupError);
      }
    }
    throw error;
  } finally {
    // Cleanup: destroy sandbox if it was created here
    // Note: If sandbox was passed in, we don't destroy it - caller manages lifecycle
    if (inSandbox && activeSandbox && !sandbox) {
      try {
        await activeSandbox.destroy();
      } catch (cleanupError) {
        console.error('Failed to cleanup sandbox in finally:', cleanupError);
      }
    }
  }
}

