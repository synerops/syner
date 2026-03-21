export interface SandboxProvider {
  readonly available: boolean
  /** Create an isolated sandbox. Returns opaque handle. */
  create(options: Record<string, unknown>): Promise<{ id: string }>
  /** Stop and clean up a sandbox */
  stop(id: string): Promise<void>
}

export interface AgentProvider {
  readonly available: boolean
  /** Resolve a model tier to concrete model identifiers */
  resolveModel(tier: string): { modelId: string; fallbacks: string[] }
}

export interface WorkflowProvider {
  readonly available: boolean
  /** Start a workflow run — delegates to Workflow DevKit start() */
  start(
    fn: (...args: unknown[]) => unknown,
    args: unknown[],
  ): Promise<{ runId: string }>
}

export interface McpClient {
  readonly available: boolean
  /** List available tools from connected MCP servers */
  listTools(): Promise<
    Array<{
      name: string
      description: string
      inputSchema: Record<string, unknown>
    }>
  >
}

export interface System {
  readonly workflow: WorkflowProvider
  readonly sandbox: SandboxProvider
  readonly agent: AgentProvider
  readonly mcp: McpClient
}
