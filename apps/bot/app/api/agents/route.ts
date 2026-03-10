import { NextResponse } from "next/server";
import { loadAgents } from "syner/agents";
import path from "path";

// ISR: revalidate every hour
export const revalidate = 3600;

// Project root is two levels up from apps/dev
function getProjectRoot(): string {
  return path.resolve(process.cwd(), "../..");
}

export async function GET() {
  try {
    const projectRoot = getProjectRoot();
    const agents = await loadAgents(projectRoot);

    return NextResponse.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
