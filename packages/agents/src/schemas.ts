import { z } from "zod"
import { asSchema } from "ai"
import type { Task, Status } from "./task"
import type { Capability } from "./capability"
import type { AgentInput } from "./agent"

/**
 * Schema for validating Agent capabilities
 * Each capability must have a name, description, tools, and input/output schemas
 */
export const CapabilityZodSchema: z.ZodType<Capability> = z.object({
  name: z.string().min(1, "Capability name is required").max(100, "Capability name too long"),
  description: z.string().min(1, "Capability description is required").max(500, "Description too long"),
  tools: z.array(z.any()).min(0, "Tools array cannot be negative"), // Tool type from AI SDK
  input: z.object({}), // Schema type from AI SDK
  output: z.object({}) // Schema type from AI SDK
})
export const CapabilitySchema = asSchema(CapabilityZodSchema)
export type ValidatedCapability = z.infer<typeof CapabilitySchema>

/**
 * Schema for validating Agent input when creating a new agent
 */
export const AgentInputZodSchema: z.ZodType<AgentInput> = z.object({
  id: z.string().min(1, "Agent ID is required").max(100, "Agent ID too long"),
  name: z.string().min(1, "Agent name is required").max(100, "Agent name too long"),
  capabilities: z.array(CapabilityZodSchema).min(1, "At least one capability is required"),
})
export const AgentInputSchema = asSchema(AgentInputZodSchema)
export type ValidatedAgentInput = z.infer<typeof AgentInputZodSchema>

/**
 * Schema for validating Task status
 */
export const TaskStatusZodSchema: z.ZodType<Status> = z.enum(["pending", "active", "done"])
export const TaskStatusSchema = asSchema(TaskStatusZodSchema)

/**
 * Schema for validating Task input
 */
export const TaskZodSchema: z.ZodType<Task> = z.object({
  id: z.string().min(1, "Task ID is required").max(100, "Task ID too long"),
  name: z.string().min(1, "Task name is required").max(200, "Task name too long"),
  goal: z.string().min(1, "Task goal is required").max(1000, "Task goal too long"),
  capability: CapabilityZodSchema,
  dependencies: z.array(z.lazy((): z.ZodType<any> => TaskZodSchema)).default([]),
  status: TaskStatusZodSchema.default("pending"),
  // input: z.any(), // JSONValue from AI SDK
  // output: z.any() // JSONValue from AI SDK
})
export const TaskSchema = asSchema(TaskZodSchema)
export type ValidatedTask = z.infer<typeof TaskZodSchema>

/**
 * Schema for validating Task execution input
 */
export const TaskExecutionInputZodSchema = z.object({
  task: TaskSchema,
  context: z.record(z.string(), z.any()).optional() // Additional context for task execution
})
export const TaskExecutionInputSchema = asSchema(TaskExecutionInputZodSchema)
export type ValidatedTaskExecutionInput = z.infer<typeof TaskExecutionInputZodSchema>

/**
 * Validation error type for better error handling
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: z.ZodError
  ) {
    super(message)
    this.name = "ValidationError"
  }

  /**
   * Get formatted error messages for user-friendly display
   */
  getFormattedErrors(): string[] {
    return this.errors.issues.map((error: z.ZodIssue) => {
      const path = error.path.join(".")
      return `${path}: ${error.message}`
    })
  }
}
