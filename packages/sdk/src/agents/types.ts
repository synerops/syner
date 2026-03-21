import type { Result } from '@syner/osprotocol'
import type { VaultStore } from '../context/vault-store'
import type { ContextRequest } from '../context/types'

export interface GenerateResult {
  text: string
  steps: number
  toolCalls: string[]
}

export interface GenerateOptions {
  vaultStore?: VaultStore
  contextRequest?: ContextRequest
  onStatus?: (status: string) => void | Promise<void>
  onToolStart?: (toolName: string) => void
  onToolFinish?: (toolName: string, durationMs: number, success: boolean) => void
  onStepFinish?: (stepNumber: number, toolNames: string[]) => void
  onResult?: (result: Result<GenerateResult>) => Promise<void> | void
}

export interface AgentCardOutput {
  name: string
  description: string
  url: string
  version: string
  capabilities: {
    streaming: boolean
    pushNotifications: boolean
  }
  skills: Array<{
    id: string
    name: string
    description: string
  }>
}

export interface Agent {
  readonly name: string
  readonly description: string
  card(): AgentCardOutput
  generate(prompt: string, options?: GenerateOptions): Promise<Result<GenerateResult>>
}
