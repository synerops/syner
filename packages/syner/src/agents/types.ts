import type { Result } from '../protocol/result'

export interface AgentCard {
  name: string
  description?: string
  instructions: string
  model?: 'opus' | 'sonnet' | 'haiku'
  tools?: string[]
  skills?: string[]
  metadata?: Record<string, unknown>
  protocol?: {
    version: string
    capabilities: string[]
  }
}

export interface GenerateResult {
  text: string
  steps: number
  toolCalls: string[]
}

export interface GenerateOptions {
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

export interface StreamOptions {
  onToolStart?: (toolName: string) => void
  onToolFinish?: (toolName: string, durationMs: number, success: boolean) => void
}

export interface AgentStream {
  fullStream: AsyncIterable<unknown>
  textStream: AsyncIterable<string>
}

export interface Agent {
  readonly name: string
  readonly description: string
  card(): AgentCardOutput
  spawn(prompt: string, options?: GenerateOptions): Promise<Result<GenerateResult>>
  stream(prompt: string, options?: StreamOptions): Promise<AgentStream>
}
