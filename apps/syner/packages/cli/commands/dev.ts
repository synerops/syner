import { Command } from 'commander';
import { createServer } from '../../server';

export function createDevCommand() {
  const cmd = new Command('dev');

  cmd
    .description('Start development server')
    .option('-p, --port <port>', 'Port to run on', '3005')
    .option('--verbose', 'Enable verbose logging')
    .action(async (options) => {
      const server = createServer({
        mode: 'development',
        port: parseInt(options.port, 10),
        verbose: Boolean(options.verbose),
      });
      await server.start();
    });

  return cmd;
}


