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
      console.log('[createSandbox] Starting sandbox creation with options:', options);
      try {
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
        console.error('[createSandbox] Error:', error);
        throw error;
      }
    }
  })

export const getSandbox = (): Sandbox | null => {
  return env.sandbox ?? null
}
