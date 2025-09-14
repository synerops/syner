import { GenerateObjectResult } from "ai"
import { Supervisor } from "../src/_supervisor"

class DevOpsSupervisor extends Supervisor {
  constructor() {
    super()
  }
}

async function main() {
  const supervisor = new DevOpsSupervisor()
  const intent = await supervisor.handle("Deploy a React app in production")
  console.log("intent", intent)
}

main()
