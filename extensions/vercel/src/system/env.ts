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
      const { sandboxId, status, timeout } = await VercelSandbox.create(options)

      env.setSandbox({
        id: sandboxId,
        status,
        timeout,
      })

      return {
        message: "Sandbox created and stored in environment",
        sandbox: getSandbox()
      }
    }
  })

export const getSandbox = (): Sandbox | null => {
  return env.sandbox ?? null
}
