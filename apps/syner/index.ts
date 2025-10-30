/**
 * syner - The Orchestrator Agent
 * @implements @syner/sdk
 */

import { Command } from 'commander';
import { createDevCommand, createBuildCommand } from './packages/cli';
import { name, description, version } from './package.json';

const program = new Command();

program
  .name(name)
  .description(description)
  .version(version);

// Top-level command: syner dev
program.addCommand(createDevCommand());
program.addCommand(createBuildCommand());

program.parse();
