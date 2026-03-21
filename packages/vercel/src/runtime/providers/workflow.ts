import type { WorkflowProvider } from '@syner/osprotocol'

export function createWorkflowProvider(): WorkflowProvider {
  return {
    available: true,
    async start(
      _fn: (...args: unknown[]) => unknown,
      _args: unknown[],
    ): Promise<{ runId: string }> {
      // TODO: Delegate to Workflow DevKit start() when integrated
      throw new Error('WorkflowProvider.start() not yet implemented — use VercelRunAdapter for now')
    },
  }
}
