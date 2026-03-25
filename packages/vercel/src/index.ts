// Primary API
export { createRuntime } from './runtime'
export type { Runtime } from './runtime'
export type { Agent, AgentCardOutput, GenerateResult, GenerateOptions } from '@syner/sdk/agents/types'

// Skills (for consumers that interact with runtime.skills)
export { SkillsMap } from '@syner/sdk/skills/map'
export type { CommandInfo } from '@syner/sdk/skills/map'
