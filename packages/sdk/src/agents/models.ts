import { gateway } from '@ai-sdk/gateway'
import type { LanguageModel } from 'ai'

export type ModelTier = 'opus' | 'sonnet' | 'haiku'

export const MODEL_IDS: Record<ModelTier, string> = {
  opus: 'anthropic/claude-opus-4.6',
  sonnet: 'anthropic/claude-sonnet-4.6',
  haiku: 'anthropic/claude-haiku-4.5',
}

export const FALLBACK_MODELS: Record<ModelTier, readonly string[]> = {
  opus: ['anthropic/claude-opus-4.5', 'anthropic/claude-opus-4', 'anthropic/claude-sonnet-4.6'],
  sonnet: ['anthropic/claude-sonnet-4.5', 'anthropic/claude-sonnet-4', 'anthropic/claude-haiku-4.5'],
  haiku: ['anthropic/claude-3.5-haiku'],
}

export function resolveModel(tier: ModelTier = 'sonnet') {
  const modelId = MODEL_IDS[tier]
  return {
    model: gateway(modelId) as LanguageModel,
    fallbacks: [...FALLBACK_MODELS[tier]],
    tier,
    modelId,
  }
}
