// In general usage, a supervisor is defined as an entity that coordinates and oversees work across others.
// This "oversight" is not limited to people; it can manage agents, workflows, and policies to align outcomes.
// Example: The supervisor decomposes a request into tasks, assigns them to the appropriate heads, and enforces traceability.
// Here, the "supervisor" depends on planning/delegation/audit capabilities, the organizational structure (departments and heads),
// and the system policies that govern how work is planned, assigned, and reported.

import { Agent } from "./agent"
import type { Task } from "./task"
import type { Schema } from "ai"

interface SupervisorResponsibilities {
  handleUserRequest(request: string): Promise<void>
  createPlan(request: string): Promise<Task[]>
  delegateTask(task: Task, agent: Agent): Promise<Schema | Error>
}

export class Supervisor extends Agent implements SupervisorResponsibilities {
  constructor() {
    super({
      id: "supervisor",
      name: "Supervisor",
      capabilities: [],
      schema: {} as Schema
    })
  }

  async handleUserRequest(request: string): Promise<void> {
    throw new Error("Not implemented")
  }

  async createPlan(request: string): Promise<Task[]> {
    throw new Error("Not implemented")
  } 

  async delegateTask(task: Task, agent: Agent): Promise<Schema | Error> {
    throw new Error("Not implemented")
  }
}