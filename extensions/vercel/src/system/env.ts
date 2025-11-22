import { tool } from "ai"
import { z } from "zod"
import { Sandbox as VercelSandbox } from "@vercel/sandbox"

import type {
  Sandbox,
  CreateSandboxOptions,
} from "@syner/sdk"
import { env } from "@syner/sdk"

export const createSandbox = (options: CreateSandboxOptions = {}) =>
  tool({
    description: "Create an ephemeral sandbox environment",
    inputSchema: z.object({}),
    execute: async () => {
      // Check for abort signal before starting
      if (options.signal?.aborted) {
        throw new Error('Sandbox creation was aborted before execution');
      }

      console.log('[createSandbox] Starting sandbox creation with options:', options);

      // Pre-execution validation: check if sandbox already exists
      const existing = env.getSandbox();
      if (existing && (existing.status === 'running' || existing.status === 'pending')) {
        console.log('[createSandbox] Existing sandbox found:', existing);
        return {
          message: "Sandbox already exists and is active",
          sandbox: existing,
          reused: true
        };
      }

      try {
        // Check for abort before async operation
        if (options.signal?.aborted) {
          throw new Error('Sandbox creation was aborted');
        }

        const { sandboxId, status, timeout } = await VercelSandbox.create(options)
        console.log('[createSandbox] Sandbox created:', { sandboxId, status, timeout });

        env.setSandbox({
          id: sandboxId,
          status,
          timeout,
        })

        const result = {
          message: "Sandbox created and stored in environment",
          sandbox: getSandbox()
        };
        console.log('[createSandbox] Result:', result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : 'Unknown error occurred';
        const errorDetails = {
          error: errorMessage,
          options: JSON.stringify(options),
          existingSandbox: existing ? existing.id : null
        };

        console.error('[createSandbox] Error:', errorDetails);

        throw new Error(
          `Failed to create sandbox: ${errorMessage}. ` +
          `Options: ${JSON.stringify(options)}. ` +
          `Existing sandbox: ${existing ? existing.id : 'none'}`
        );
      }
    }
  })

export const getSandbox = (): Sandbox | null => {
  return env.sandbox ?? null
}
