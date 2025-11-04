import { Command } from 'commander';
import { AGENTS_CONFIG_FILE } from '../const';
import { loadAgents } from '../../services/agent-loader';
import { createServer } from '../../server';

export function createDevCommand() {
  const cmd = new Command('dev');

  cmd
    .description('Start the development server')
    .option(
      '-p, --port <number>',
      'Port number (default: 3000)',
      '3000'
    )
    .action(async (options) => {
      try {
        // Load agents
        const { agents } = await loadAgents(AGENTS_CONFIG_FILE);

        // Start server
        createServer({
          port: parseInt(options.port, 10),
          agents,
          development: process.env.NODE_ENV === 'development',
        });

      } catch (error) {
        console.error(`\n✗ Error: ${(error as Error).message}\n`);
        process.exit(1);
      }
    });

  return cmd;
}
