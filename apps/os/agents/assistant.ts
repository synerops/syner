import { intentParser } from "@/tools/intent-parser"
import { Supervisor } from "@syner/agents"

export const capabilities = {
  understanding: {
    description: "Interpret the user's intention directly",
    tools: [
      intentParser
    ]
  },
  execution: {
    description: "Use its own tools (tools) to resolve the task",
  },
  response: {
    description: "Deliver the final response without the need to pass through other agents"
  }
}

export class Assistant extends Supervisor {
  constructor() {
    super()
  }
}