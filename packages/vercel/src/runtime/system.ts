import type { System } from '@syner/osprotocol'
import { createSandboxProvider } from './providers/sandbox'
import { createAgentProvider } from './providers/agent'
import { createWorkflowProvider } from './providers/workflow'
import { createMcpClient } from './providers/mcp'

export function createSystem(): System {
  return {
    sandbox: createSandboxProvider(),
    agent: createAgentProvider(),
    mcp: createMcpClient(),
    workflow: createWorkflowProvider(),
  }
}
