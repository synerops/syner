import type { McpClient } from '@syner/osprotocol'

export function createMcpClient(): McpClient {
  return {
    available: false,
    async listTools() {
      return []
    },
  }
}
