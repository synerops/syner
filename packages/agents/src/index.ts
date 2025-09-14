// Main exports for the @syner/agents package
export { createAgent, execute, can } from "./agent"
export { Supervisor } from "./_supervisor"
export type { AgentInput } from "./agent"
export type { Task } from "./task"
export type { Capability } from "./capability"

// Validation exports
export { 
  AgentInputSchema, 
  TaskSchema, 
  CapabilitySchema, 
  TaskStatusSchema,
  TaskExecutionInputSchema,
  ValidationError,  
  type ValidatedAgentInput,
  type ValidatedTask,
  type ValidatedCapability,
  type ValidatedTaskExecutionInput
} from "./schemas"
