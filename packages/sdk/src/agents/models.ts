import { gateway } from '@ai-sdk/gateway'
import type { LanguageModel } from 'ai'
import type { AgentCard } from './loader'

export const MODEL_IDS = {
  opus: 'anthropic/claude-opus-4.6',
  sonnet: 'anthropic/claude-sonnet-4.6',
  haiku: 'anthropic/claude-haiku-4.5',
} as const

export const FALLBACK_MODELS = {
  opus: ['anthropic/claude-opus-4.5', 'anthropic/claude-opus-4', 'anthropic/claude-sonnet-4.6'],
  sonnet: ['anthropic/claude-sonnet-4.5', 'anthropic/claude-sonnet-4', 'anthropic/claude-haiku-4.5'],
  haiku: ['anthropic/claude-3.5-haiku'],
} as const

export function getModel(config: AgentCard): LanguageModel {
  const tier = config.model ?? 'sonnet'
  const modelId = MODEL_IDS[tier]
  return gateway(modelId)
}

export function getModelFallbacks(config: AgentCard): string[] {
  const tier = config.model ?? 'sonnet'
  return [...FALLBACK_MODELS[tier]]
}
