import { NextResponse } from "next/server";
import { loadAgents, getAgentByName } from "syner/agents";
import path from "path";

// ISR: revalidate every hour
export const revalidate = 3600;

// Only serve pre-generated routes, never call fs at runtime
export const dynamicParams = false;

// Project root is two levels up from apps/dev
function getProjectRoot(): string {
  return path.resolve(process.cwd(), "../..");
}

// Pre-generate routes for all agents at build time
export async function generateStaticParams() {
  const projectRoot = getProjectRoot();
  const agents = await loadAgents(projectRoot);
  return agents.map((agent) => ({
    name: agent.name,
  }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const projectRoot = getProjectRoot();
  const agent = await getAgentByName(projectRoot, name);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json(agent);
}
