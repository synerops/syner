// An Agent is an autonomous entity that operates within a domain by applying its capabilities to perform tasks and achieve outcomes.
// It does this through its capabilities, which are the skills or strengths it has. These capabilities can combine knowledge, ways of working, or resources it can use.
// Example: A travel Agent that can find flights, suggest hotels, and organize an itinerary.
// Here, the Agent uses its capabilities (finding, suggesting, organizing) to turn a request into a helpful result.

import type { Capability } from "./capability"
import type { Task } from "./task"
import type { JSONValue, Schema } from "ai"
import { z } from "zod"
import { AgentInputZodSchema, TaskSchema, ValidationError, type ValidatedAgentInput, type ValidatedTask } from "./schemas"

export interface AgentInput {
  id: string
  name: string
  capabilities: Capability[]
}

export const capabilities: Capability[] = [];

/**
 * Execute a task with input validation
 * @param task - The task to execute
 * @returns Promise with the result or validation error
 */
export async function execute(task: Task): Promise<JSONValue | Error> {
  try {
    // Validate the task input
    // const validatedTask = TaskSchema.parse(task)
    // console.log("Validated task:", validatedTask)
    
    // TODO: Implement actual task execution logic
    throw new Error("Task execution not implemented")
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error("Task validation failed:", error.getFormattedErrors())
      return error
    }
    throw error
  }
}

/**
 * Check if the agent has the given capability
 * @param capability - The capability to check
 * @returns True if the agent has the capability, false otherwise
 * @example
 * agent.can(Capability.plan) // true
 * agent.can("plan") // true
 */
export function can(capability: Capability | string): boolean {
  if (typeof capability === 'string') {
    return capabilities.some(c => c.name === capability)
  }

  return capabilities.some(c => c.name === capability.name)
}

export class Agent {
  public id: string
  public name: string
  public capabilities: Capability[]

  constructor(input: ValidatedAgentInput) {
    this.id = input.id
    this.name = input.name
    this.capabilities = input.capabilities
  }
}

/**
 * Create a new agent with input validation
 * @param input - The agent input data
 * @returns Promise with the created agent or validation error
 */
export async function createAgent(input: AgentInput): Promise<Agent | ValidationError> {
  try {
    // Validate the input
    const validatedInput = await AgentInputZodSchema.safeParseAsync(input)
    
    if (!validatedInput.success) {
      throw new ValidationError("Invalid agent input", validatedInput.error)
    }
    
    // Create the agent with validated input
    console.log("Validated input:", validatedInput.data)
    return new Agent(validatedInput.data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(new ValidationError("Invalid agent input", error).getFormattedErrors())
      throw new ValidationError("Invalid agent input", error)
    }
    throw error
  }
}
