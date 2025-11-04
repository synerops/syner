import type { Agent } from '@syner/sdk';

// Singleton to store agents (set once on server start)
let agentsRegistry: Agent[] = [];

export function initializeAgents(agents: Agent[]) {
  agentsRegistry = agents;
}

// Helper to get normalized agent ID
function getAgentId(agent: Agent): string {
  return agent.id || agent.name.toLowerCase().replace(/\s+/g, '-');
}

// Helper to find agent by ID
function findAgent(id: string): Agent | undefined {
  return agentsRegistry.find(a => getAgentId(a) === id);
}

// GET /agents - List all agents
export const listAgents = {
  GET: () => {
    return Response.json({
      agents: agentsRegistry.map(agent => ({
        id: getAgentId(agent),
        name: agent.name,
        description: agent.description || 'No description available'
      })),
      count: agentsRegistry.length
    });
  }
};

// GET /agents/:id - Get single agent details
export const getAgent = (req: Request) => {
  const agent = findAgent(req.params.id);

  if (!agent) {
    return Response.json(
      { error: 'Agent not found', agent_id: req.params.id },
      { status: 404 }
    );
  }

  return Response.json({
    id: getAgentId(agent),
    name: agent.name,
    description: agent.description || 'No description available',
    version: agent.version || '1.0.0',
    capabilities: agent.capabilities || [],
    metadata: agent.metadata || {}
  });
};

// POST /agents/:id/runs - Create a new agent run
export const createAgentRun = {
  POST: async (req: Request) => {
    const agent = findAgent(req.params.id);

    if (!agent) {
      return Response.json(
        { error: 'Agent not found', agent_id: req.params.id },
        { status: 404 }
      );
    }

    try {
      const body = await req.json();
      const runId = `run_${crypto.randomUUID().replace(/-/g, '')}`;

      // TODO: Actually execute the agent
      // For now, just return the run metadata
      
      return Response.json({
        run_id: runId,
        agent_id: req.params.id,
        status: 'running',
        created_at: new Date().toISOString(),
        input: body.input || {},
        _links: {
          self: `/agents/${req.params.id}/runs/${runId}`,
          agent: `/agents/${req.params.id}`
        }
      }, { status: 201 });

    } catch (error) {
      return Response.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
  }
};

