import type { SandboxProvider } from '@syner/osprotocol'
import { createSandbox, stopSandbox, type Sandbox } from '../sandbox'

export function createSandboxProvider(): SandboxProvider {
  const instances = new Map<string, Sandbox>()

  return {
    available: true,

    async create(options: Record<string, unknown>): Promise<{ id: string }> {
      const result = await createSandbox({
        repoUrl: options.repoUrl as string,
        branch: options.branch as string,
        timeout: (options.timeout as number) ?? 300_000,
      })
      const id = crypto.randomUUID()
      instances.set(id, result.sandbox)
      return { id }
    },

    async stop(id: string): Promise<void> {
      const sandbox = instances.get(id)
      if (sandbox) {
        await stopSandbox(sandbox)
        instances.delete(id)
      }
    },
  }
}
