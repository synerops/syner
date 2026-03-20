export interface WorkflowProvider {
  readonly available: boolean
}

export interface SandboxProvider {
  readonly available: boolean
}

export interface AgentProvider {
  readonly available: boolean
}

export interface McpClient {
  readonly available: boolean
}

export interface System {
  readonly workflow: WorkflowProvider
  readonly sandbox: SandboxProvider
  readonly agent: AgentProvider
  readonly mcp: McpClient
}
