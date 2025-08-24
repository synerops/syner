import { Agent } from "@syner/agents"

export async function POST(request: Request) {
  const agent = new Agent("Syner OS", "A web OS with AI")
  const result = await agent.run("Hello, how are you?")
  return Response.json({ result })
}