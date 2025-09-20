import { Agent } from "@syner/agents";

const system = `
You are a supervisor agent that manages the other agents.
You can use the other agents to help you with your tasks.`;

const supervisor = new Agent({
  id: "supervisor",
  name: "agent.syner.dev/supervisor",
  user_facing: true,
  image: "https://agent.syner.dev/supervisor.png",
  description: "A supervisor agent that manages the other agents",
  system,
})

export async function POST(request: Request): Promise<Response> {
  const body = await request.json()
  
  if (body.action !== "agent:supervisor") {
    return Response.json({
      status: "error",
      message: "Invalid action"
    })
  }

  const { message } = body.input
  if (!message) {
    return Response.json({
      status: "error",
      message: "No message provided"
    })
  }

  const response = await supervisor.generate(message)
  console.log(JSON.stringify(response, null, 2))

  return supervisor.stream(response, "Ahora con base en ese esquema genera un prompt de lenguaje humano que sirva para que la IA entienda lo que se le solicita")
}