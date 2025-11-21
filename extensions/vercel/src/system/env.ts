import { tool } from "ai"
import { z } from "zod"
import { Sandbox as VercelSandbox } from "@vercel/sandbox"

import { env } from "@syner/sdk/system/env"
import type { Sandbox } from "@syner/sdk/system/sandbox"

type CreateSandboxOptions = {
  source?:
    | {
        type: "git"
        url: string
        depth?: number
        revision?: string
      }
    | {
        type: "git"
        url: string
        username: string
        password: string
        depth?: number
        revision?: string
      }
    | {
        type: "tarball"
        url: string
      }
  ports?: number[]
  timeout?: number
  resources?: {
    vcpus: number
  }
  runtime?: string | "node22" | "python3.13"
  signal?: AbortSignal
}

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
