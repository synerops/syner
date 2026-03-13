import { NextResponse } from "next/server";
import { getAgentByName } from "@syner/sdk/agents";
import path from "path";

// Dynamic — no caching for POST
export const dynamic = "force-dynamic";

const AGENT_NAME_PATTERN = /^[a-z0-9-]+$/;

function getProjectRoot(): string {
  return process.env.PROJECT_ROOT || path.resolve(process.cwd(), "../..");
}

interface AgentRequest {
  agentName?: string;
  task?: string;
}

export async function POST(request: Request) {
  // Auth: Vercel protection bypass (same pattern as GET /agents)
  if (process.env.VERCEL_URL) {
    const bypass = request.headers.get('x-vercel-protection-bypass');
    if (bypass !== process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

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

  if (!AGENT_NAME_PATTERN.test(agentName)) {
    return NextResponse.json(
      { error: "Invalid agentName: must match /^[a-z0-9-]+$/" },
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

    // Full agent card — orchestrator needs metadata for routing
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
