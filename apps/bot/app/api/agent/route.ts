import { NextResponse } from "next/server";
import { getAgentByName } from "@syner/sdk/agents";
import path from "path";

// Dynamic — no caching for POST
export const dynamic = "force-dynamic";

function getProjectRoot(): string {
  return path.resolve(process.cwd(), "../..");
}

interface AgentRequest {
  agentName?: string;
  task?: string;
}

export async function POST(request: Request) {
  let body: AgentRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { agentName, task } = body;

  if (!agentName || typeof agentName !== "string") {
    return NextResponse.json(
      { error: "Missing required field: agentName" },
      { status: 400 }
    );
  }

  if (!task || typeof task !== "string") {
    return NextResponse.json(
      { error: "Missing required field: task" },
      { status: 400 }
    );
  }

  try {
    const projectRoot = getProjectRoot();
    const agent = await getAgentByName(projectRoot, agentName);

    if (!agent) {
      return NextResponse.json(
        { error: `Agent not found: ${agentName}` },
        { status: 404 }
      );
    }

    // osprotocol-compatible response
    return NextResponse.json({
      status: "accepted",
      agent: {
        name: agent.name,
        description: agent.description,
        tools: agent.tools,
        skills: agent.skills,
        model: agent.model,
        protocol: agent.protocol,
      },
      task,
    });
  } catch (error) {
    console.error("Error resolving agent:", error);
    return NextResponse.json(
      { error: "Failed to resolve agent" },
      { status: 500 }
    );
  }
}
