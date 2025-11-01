/**
 * syner - The Orchestrator Agent
 * @implements @syner/sdk
 */

import { Command } from 'commander';
import {
  createDevCommand,
  createBuildCommand,
} from './packages/cli';

const program = new Command();

program
  .name(`syner`)
  .description(`syner OS: The Fullstack Agent`)

// Top-level command: syner dev
program.addCommand(createDevCommand());
program.addCommand(createBuildCommand());

program.parse();
