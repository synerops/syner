import { NextRequest, NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { AgentRegistry, loadConfig, resolveConfigDirectory } from "@syner/sdk";

// Cache registry to avoid discovering agents on every request
let registryCache: AgentRegistry | null = null;
let agentsDirCache: string | null = null;

async function getAgentRegistry(): Promise<AgentRegistry> {
  if (registryCache && agentsDirCache) {
    return registryCache;
  }

  // Load configuration from agents.json
  const config = await loadConfig();
  const agentsDir = resolveConfigDirectory(config);
  
  // Create registry and discover agents
  const registry = new AgentRegistry();
  await registry.discover(agentsDir);
  
  // Cache for subsequent requests
  registryCache = registry;
  agentsDirCache = agentsDir;
  
  return registry;
}

export async function handleAgentCard(
  request: NextRequest,
  agentName?: string
): Promise<NextResponse> {
  try {
    // If agentName is provided, return specific agent card
    if (agentName) {
      const registry = await getAgentRegistry();
      const agent = registry.get(agentName);
      
      if (!agent) {
        notFound();
      }
      
      // Build agent-card from agent information
      const agentCard = {
        "@context": "https://www.w3.org/ns/did/v1",
        "id": `syner://agent/${agent.name}`,
        "name": agent.name,
        "description": agent.description || `Agent ${agent.name} from Syner OS`,
        "capabilities": agent.capabilities || [
          "context-gathering",
          "action-execution",
          "result-verification"
        ],
        "endpoints": {
          "mcp": `/api/agents/${agent.name}/mcp`,
          "card": `/api/agents/${agent.name}/card`
        }
      };
      
      return NextResponse.json(agentCard, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Global agent card (for /.well-known/agent-card.json)
    const registry = await getAgentRegistry();
    const allAgents = registry.all();
    
    const globalCard = {
      "@context": "https://www.w3.org/ns/did/v1",
      "id": "syner://os",
      "name": "Syner OS",
      "description": "Syner OS Agentic Operating System",
      "capabilities": [
        "context-gathering",
        "action-execution",
        "result-verification",
        "multi-agent-coordination"
      ],
      "agents": allAgents.map((agent) => ({
        name: agent.name,
        description: agent.description,
        endpoints: {
          card: `/api/agents/${agent.name}/card`,
          mcp: `/api/agents/${agent.name}/mcp`
        }
      })),
      "endpoints": {
        "mcp": "/api/mcp"
      }
    };

    return NextResponse.json(globalCard, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    // Error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        error: 'Failed to load agent card',
        message: errorMessage
      },
      { status: 500 }
    );
  }
}