import { Command } from 'commander';
import { checkHealth } from '@syner/api/health';
import { AgentRegistry, loadConfig, resolveAgentsDirectory } from '@syner/sdk';
import { AGENTS_CONFIG_FILE } from '../const';

export function createDevCommand() {
  const cmd = new Command('dev');

  cmd
    .description('Start the development server')
    .option(
      '-p --port <number>',
      'Specify the port number (default: 3000)',
      '3000'
    )
    .action(
      async (options) => {
        try {
          // Load agents.json from current directory
          const config = await loadConfig(AGENTS_CONFIG_FILE);
          console.log(`📋 Loaded config from ${AGENTS_CONFIG_FILE}`);

          // Resolve agents directory to absolute path
          const agentsDir = resolveAgentsDirectory(config);
          console.log(`🔍 Discovering agents in ${agentsDir}`);

          // Discover agents
          const registry = new AgentRegistry();
          const agents = await registry.discover(agentsDir);

          if (agents.length === 0) {
            console.log(`⚠️  No agents found in ${agentsDir}`);
          } else {
            console.log(`✓ Discovered ${agents.length} agent${agents.length !== 1 ? 's' : ''}`);
            agents.forEach(agent => {
              console.log(`  - ${agent.name}`);
            });
          }

        } catch (error) {
          console.error(`✗ Error: ${(error as Error).message}`);
          process.exit(1);
        }

        const server = Bun.serve({
          port: options.port,
          routes: {
            '/api/health': () => Response.json(
              checkHealth()
            ),
          },
          development: process.env.NODE_ENV === 'development' && {
            hmr: true,
            console: true,
          }
        });

        console.log(`🚀 syner started: ${server.url}`);
      }
    );

  return cmd;
}
