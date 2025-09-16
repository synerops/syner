import { createSupervisor } from "@/src/supervisor"

export async function POST(request: Request) {
  const supervisor = await createSupervisor()
  const plan = await supervisor.plan("Deploy a React app in production")
  return Response.json({ plan })
}