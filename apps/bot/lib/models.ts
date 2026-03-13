/**
 * Model provisioning for executeSkill()
 *
 * Resolves which LanguageModel to use based on the agent being invoked.
 * Orchestrator (syner) gets Opus; all other agents get Sonnet.
 */

import { createAnthropic } from '@ai-sdk/anthropic'
import type { LanguageModel } from 'ai'

export interface ModelConfig {
  modelId: string
  apiKey?: string
}

const SONNET = 'claude-sonnet-4-5-20250514'
const OPUS = 'claude-opus-4-5-20250514'

const ORCHESTRATOR_AGENT = 'syner'

/**
 * Resolve the LanguageModel for a given agent.
 *
 * - "syner" (orchestrator) → Opus
 * - All other agents → Sonnet
 */
export function resolveModel(agentName: string): LanguageModel {
  const config = resolveModelConfig(agentName)
  const provider = createAnthropic({ apiKey: config.apiKey })
  return provider(config.modelId)
}

/**
 * Resolve model configuration without creating the provider.
 * Useful for inspection / logging.
 */
export function resolveModelConfig(agentName: string): ModelConfig {
  const modelId = agentName === ORCHESTRATOR_AGENT ? OPUS : SONNET
  const apiKey = process.env.ANTHROPIC_API_KEY

  return { modelId, apiKey }
}
