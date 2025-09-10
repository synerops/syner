// An Agent is an autonomous entity that operates within a domain by applying its capabilities to perform tasks and achieve outcomes.
// It does this through its capabilities, which are the skills or strengths it has. These capabilities can combine knowledge, ways of working, or resources it can use.
// Example: A travel Agent that can find flights, suggest hotels, and organize an itinerary.
// Here, the Agent uses its capabilities (finding, suggesting, organizing) to turn a request into a helpful result.

import type { Schema } from "ai"
import type { Capability } from "./capability"
import type { Task } from "./task"

export interface AgentInput {
  id: string
  name: string
  capabilities: Capability[]
  schema: Schema
}

export abstract class Agent {
  protected capabilities: Capability[]
  protected schema: Schema

  constructor(input: AgentInput) {
    this.capabilities = input.capabilities
    this.schema = input.schema
  }

  async execute(task: Task): Promise<Schema | Error> {
    throw new Error("Not implemented")
  }
}