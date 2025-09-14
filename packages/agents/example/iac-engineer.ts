import { GenerateObjectResult } from "ai"
import { createAgent } from "../src/agent"

// class DevOpsSupervisor extends Supervisor {
//   constructor() {
//     super()
//   }
// }

async function main() {
  const iacEngineer = await createAgent({
    id: "iac-engineer",
    name: "IAC Engineer",
    capabilities: [
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
          plan: {
            type: "object",
            properties: {
              actions: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    ],
  })
  console.log("iacEngineer", iacEngineer)
  // const intent = await iacEngineer.handle("Deploy a React app in production")
  // console.log("intent", intent)
}

main()
