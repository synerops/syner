import { NextResponse } from "next/server";
import { getAgentByName } from "@syner/sdk/agents";
import { createSession } from "@/lib/session";
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

    // Create session and execute the task
    const session = await createSession({ agent });

    try {
      const result = await session.generate(task);
      return NextResponse.json(result);
    } finally {
      await session.cleanup();
    }
  } catch (error) {
    console.error("Error executing agent task:", error);
    return NextResponse.json(
      { error: "Failed to execute agent task" },
      { status: 500 }
    );
  }
}
