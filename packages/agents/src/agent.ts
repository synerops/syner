// An Agent is an autonomous entity that operates within a domain by applying its capabilities to perform tasks and achieve outcomes.
// It does this through its capabilities, which are the skills or strengths it has. These capabilities can combine knowledge, ways of working, or resources it can use.
// Example: A travel Agent that can find flights, suggest hotels, and organize an itinerary.
// Here, the Agent uses its capabilities (finding, suggesting, organizing) to turn a request into a helpful result.

import type { Capability } from "./capabilities"
import type { Task } from "./task"
import type { JSONValue } from "ai"

export interface AgentInput {
  id: string
  name: string
  capabilities: Capability[]
}

export abstract class Agent {
  public id: string
  public name: string
  public capabilities: Capability[]

  constructor(input: AgentInput) {
    this.id = input.id
    this.name = input.name
    this.capabilities = input.capabilities
  }

  async execute(task: Task): Promise<JSONValue | Error> {
    console.log("task", task)
    throw new Error("Not implemented")
  }

  can(capability: Capability | string): boolean {
    if (typeof capability === 'string') {
      return this.capabilities.some(c => c.name === capability)
    }
    return this.capabilities.some(c => c.name === capability.name)
  }
}