// In general usage, a task is defined as a unit of work to be completed. 
// This "work" is not limited to manual effort, it can involve human actions, automated processes, or AI-driven executions.
// Example: The team has a task to update the customer dashboard by Friday.
// Here, the "task" depends on who executes it (person, agent, or system), 
// the resources required, and the context in which it is performed.

import type { Schema } from "ai"
import type { Capability } from "./capability"

type Status = "pending" | "active" | "done"

export type Task = {
  id: string
  title: string
  goal: string
  capability: Capability
  dependencies: Task[]
  status: Status
  input: Schema
  output: Schema
}
