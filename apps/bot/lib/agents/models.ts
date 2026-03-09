import { anthropic } from '@ai-sdk/anthropic'
import type { AgentConfig } from './loader'

const MODEL_IDS = {
  opus: 'claude-opus-4-20250514',
  sonnet: 'claude-sonnet-4-20250514',
  haiku: 'claude-haiku-4-20250514',
} as const

export function getModel(config: AgentConfig) {
  const modelId = MODEL_IDS[config.model ?? 'sonnet']
  return anthropic(modelId)
}
