import { anthropic } from '@ai-sdk/anthropic'
import type { LanguageModel } from 'ai'
import type { AgentConfig } from './loader'

export const MODEL_IDS = {
  opus: 'claude-opus-4-20250514',
  sonnet: 'claude-sonnet-4-20250514',
  haiku: 'claude-haiku-4-20250514',
} as const

export function getModel(config: AgentConfig): LanguageModel {
  const modelId = MODEL_IDS[config.model ?? 'sonnet']
  return anthropic(modelId)
}
