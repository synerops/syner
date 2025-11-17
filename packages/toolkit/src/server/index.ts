import {
  NextRequest,
  NextResponse,
} from "next/server";
import { notFound } from "next/navigation";
import { handleAgentCard } from "./handlers/agent-card";
import { handleAgentMCP } from "./handlers/agent-mcp";

type Params = { 
  slug?: string[]
}

export async function handler(
  request: NextRequest,
  context: { params: Promise<Params> }
): Promise<NextResponse> {
  const { params } = context;
  const segments = (await params).slug || [];

  // /api/agents/[agentName]/card
  // Example: /api/agents/syner/card
  if (segments[0] === 'agents' && segments.length === 3 && segments[2] === 'card') {
    const agentName = segments[1];
    return handleAgentCard(request, agentName);
  }

  // /api/agents/[agentName]/mcp
  // Example: /api/agents/syner/mcp
  if (segments[0] === 'agents' && segments.length === 3 && segments[2] === 'mcp') {
    const agentName = segments[1];
    return handleAgentMCP(request, agentName, segments.slice(3));
  }

  // /api/mcp (global MCP endpoint)
  // if (path === 'api/mcp') {
  //   return handleGlobalMCP(request, segments.slice(1));
  // }

  // /.well-known/agent-card.json (global agent card)
  if (segments[0] === '.well-known' && segments[1] === 'agent-card.json') {
    return handleAgentCard(request);
  }

  // No route matched
  notFound();
}