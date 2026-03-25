/**
 * MCP Client — connects TO external MCP servers.
 *
 * Bot is an orchestrator that consumes capabilities from external services
 * (Linear, Notion, etc.) via MCP. This module provides the client infrastructure.
 *
 * First integrations are backlog — this builds the client that makes them possible.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

export interface McpServerConfig {
  name: string
  command: string
  args?: string[]
  env?: Record<string, string>
}

export interface McpConnection {
  name: string
  client: Client
  transport: StdioClientTransport
}

const connections = new Map<string, McpConnection>()

/**
 * Connect to an MCP server via stdio transport.
 */
export async function connectMcpServer(config: McpServerConfig): Promise<McpConnection> {
  if (connections.has(config.name)) {
    return connections.get(config.name)!
  }

  const transport = new StdioClientTransport({
    command: config.command,
    args: config.args,
    env: config.env,
  })

  const client = new Client(
    { name: 'syner-bot', version: '0.1.1' },
    { capabilities: {} },
  )

  await client.connect(transport)

  const connection: McpConnection = { name: config.name, client, transport }
  connections.set(config.name, connection)

  return connection
}

/**
 * List tools available on a connected MCP server.
 */
export async function listMcpTools(serverName: string) {
  const conn = connections.get(serverName)
  if (!conn) throw new Error(`MCP server "${serverName}" not connected`)

  const result = await conn.client.listTools()
  return result.tools
}

/**
 * Call a tool on a connected MCP server.
 */
export async function callMcpTool(serverName: string, toolName: string, args: Record<string, unknown> = {}) {
  const conn = connections.get(serverName)
  if (!conn) throw new Error(`MCP server "${serverName}" not connected`)

  const result = await conn.client.callTool({ name: toolName, arguments: args })
  return result
}

/**
 * Disconnect from an MCP server.
 */
export async function disconnectMcpServer(serverName: string) {
  const conn = connections.get(serverName)
  if (!conn) return

  await conn.client.close()
  connections.delete(serverName)
}

/**
 * List all connected servers.
 */
export function listConnectedServers() {
  return [...connections.keys()]
}
