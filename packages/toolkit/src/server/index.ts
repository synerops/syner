import {
  NextRequest,
  NextResponse,
} from "next/server";
import { notFound } from "next/navigation";
import { handleAgentCard } from "./handlers/agent-card";
import { handleAgentMCP } from "./handlers/agent-mcp";
import { byName } from "syner/agents";

type Params = {
  slug?: string[]
}

export async function handler(
  req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse> {
  const agent = byName(agentName)

  if (!agent) {
    return notFound();
  }

  return NextResponse.json(
    await agent.toCard()
  );
  }
