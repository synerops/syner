import type { Agent } from "../src/agent"
import { createAgent } from "../src/agent"
import type { Capability } from "../src/capability"

// class DevOpsSupervisor extends Supervisor {
//   constructor() {
//     super()
//   }
// }

const capabilities: Capability[] = [
  {
    name: "iac:plan",
    description: "Plan the infrastructure changes",
    tools: [],
    input: {
      application: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    output: {
      type: "object",
      properties: {
      plan: {
          actions: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
  // {
  //   name: "iac:deploy",
  //   description: "Deploy the infrastructure changes",
  //   tools: [],
  // },
  
]

export async function POST(request: Request) {
  const basicAgent = await createAgent({
    id: "basic-agent",
    name: "Basic Agent",
    capabilities,
  })
  
  const { stream } = await basicAgent.respond([
    {
      role: "user",
      content: "What is the capital of France?",
    }
  ])

  return new Response(stream.toDataStreamResponse())
}
