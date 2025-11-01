import { bundle } from '../../bundle';
import { Command } from 'commander';

export function createBuildCommand() {
  const cmd = new Command('build');

  cmd
    .description('Build the application')
    .option(
      '-o --output <path>',
      'Specify the output directory (default: dist)',
      'dist'
    )
    .action(
      (options) => bundle({ output: options.output })
    );

  return cmd;
}
