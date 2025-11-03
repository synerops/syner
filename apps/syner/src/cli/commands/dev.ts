import { Command } from 'commander';
import { checkHealth } from '@syner/api/health';

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
      (options) => {
        const server = Bun.serve({
          port: options.port,
          routes: {
            '/api/health': () => Response.json(
              checkHealth()
            ),
          },
        })

        console.log(`syner started: ${server.url}`)
      }
    );

  return cmd;
}
