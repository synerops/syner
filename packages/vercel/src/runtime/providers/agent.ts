import type { AgentProvider } from '@syner/osprotocol'
import { resolveModel, type ModelTier } from 'syner/agents'

export function createAgentProvider(): AgentProvider {
  return {
    available: true,
    resolveModel(tier: string) {
      const resolved = resolveModel(tier as ModelTier)
      return { modelId: resolved.modelId, fallbacks: [...resolved.fallbacks] }
    },
  }
}
