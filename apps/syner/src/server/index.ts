import type { ServerConfig, ServerInstance } from './types';
import { initializeAgents, listAgents, getAgent, createAgentRun } from './routes/agents';
import { healthRoute } from './routes/health';

export function createServer(config: ServerConfig): ServerInstance {
  // Initialize agents registry
  initializeAgents(config.agents);

  const server = Bun.serve({
    port: config.port,
    
    // Bun's native router - clean and declarative!
    routes: {
      // Health check
      '/api/health': healthRoute,
      
      // Agents API
      '/agents': listAgents,
      '/agents/:id': getAgent,
      '/agents/:id/runs': createAgentRun,
    },

    // Fallback for unmatched routes
    fetch(req) {
      return new Response('Not Found', { status: 404 });
    },

    // Development mode with HMR
    development: config.development && {
      hmr: true,
      console: true,
    },

    // Error handler
    error(error) {
      console.error('Server error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  });

  // Beautiful startup message
  console.log(`\n🚀 Syner OS started successfully!`);
  console.log(`📡 Server: ${server.url}`);
  console.log(`🤖 Agents loaded: ${config.agents.length}\n`);
  
  if (config.agents.length > 0) {
    console.log(`🔗 API Endpoints:`);
    console.log(`   GET  ${server.url}agents`);
    console.log(`   GET  ${server.url}agents/{id}`);
    console.log(`   POST ${server.url}agents/{id}/runs`);
    console.log(``);
  }

  return server;
}

export * from './types';

