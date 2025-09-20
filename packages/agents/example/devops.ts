import { Supervisor } from "@/src/supervisor"

const config = {
  system: `You are a DevOps Director that manages the other agents.`
}

export async function POST(request?: Request) {
  const supervisor = new Supervisor(config)
  const plan = await supervisor.plan("Deploy a React app in production")
  return Response.json({ plan })
}

POST()