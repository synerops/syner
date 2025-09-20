// An Agent is an autonomous entity that operates within a domain by applying its capabilities to perform tasks and achieve outcomes.
// It does this through its capabilities, which are the skills or strengths it has. These capabilities can combine knowledge, ways of working, or resources it can use.
// Example: A travel Agent that can find flights, suggest hotels, and organize an itinerary.
// Here, the Agent uses its capabilities (finding, suggesting, organizing) to turn a request into a helpful result.

import type { Capability } from "./capability"
// import type { Task } from "./task"
// import type { JSONValue, Schema } from "ai"
import { z } from "zod"
import type { Tool } from "ai"
import { 
  CreateAgentPropsZodSchema, 
  TaskSchema, 
  ValidationError, 
  type ValidatedCreateAgentProps, 
  type ValidatedTask 
} from "./schemas"
import { openai } from "@ai-sdk/openai"
import { 
  convertToModelMessages, 
  GenerateObjectResult, 
  Prompt, 
  Schema, 
  streamText, 
  UIMessage,
  StreamTextResult,
  StreamObjectResult,
  ToolSet,
} from "ai"

export interface CreateAgentProps {
  id: string
  name: string
  capabilities: Capability[]
}

// export const capabilities: Capability[] = [];

/**
 * Execute a task with input validation
 * @param task - The task to execute
 * @returns Promise with the result or validation error
 */
// export async function execute(task: Task): Promise<JSONValue | Error> {
//   try {
//     // Validate the task input
//     // const validatedTask = TaskSchema.parse(task)
//     // console.log("Validated task:", validatedTask)
    
//     // TODO: Implement actual task execution logic
//     throw new Error("Task execution not implemented")
//   } catch (error) {
//     if (error instanceof ValidationError) {
//       console.error("Task validation failed:", error.getFormattedErrors())
//       return error
//     }
//     throw error
//   }
// }

/**
 * Check if the agent has the given capability
 * @param capability - The capability to check
 * @returns True if the agent has the capability, false otherwise
 * @example
 * agent.can(Capability.plan) // true
 * agent.can("plan") // true
 */
// export function can(capability: Capability | string): boolean {
//   if (typeof capability === 'string') {
//     return capabilities.some(c => c.name === capability)
//   }

//   return capabilities.some(c => c.name === capability.name)
// }

export class Agent {
  public id: string
  public name: string
  public capabilities: Capability[]

  constructor(input: CreateAgentProps) {
    this.id = input.id
    this.name = input.name
    this.capabilities = input.capabilities
    // this.settings = input.settings
  }

  public respond(messages: UIMessage[]): Response {
    throw new Error("Not implemented")
    // return this.stream({
    //   prompt: convertToModelMessages(messages),
    // }).toUIMessageStreamResponse();
  }

  public async stream(opts: Prompt): StreamTextResult<Tool[], PartialOutput> {
    // console.log(this.settings)
    // return streamText(...this.settings, opts);
    throw new Error("Not implemented")
  }

  get tools(): Tool[] {
    return this.capabilities.flatMap(c => c.tools)
  }

}

/**
 * Create a new agent with input validation
 * @param input - The agent input data
 * @returns Promise with the created agent or validation error
 */
export async function createAgent(input: CreateAgentProps): Promise<Agent | ValidationError> {
  try {
    // Validate the input
    const validatedInput = await CreateAgentPropsZodSchema.safeParseAsync(input)
    
    if (!validatedInput.success) {
      throw new ValidationError("Invalid agent input", validatedInput.error)
    }
    
    // Create the agent with validated input
    return new Agent(validatedInput.data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(new ValidationError("Invalid agent input", error).getFormattedErrors())
      throw new ValidationError("Invalid agent input", error)
    }

    throw error
  }
}

