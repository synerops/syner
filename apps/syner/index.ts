/**
 * syner - The Orchestrator Agent
 * @implements @syner/sdk
 */

import { Command } from 'commander';
import {
  createDevCommand,
  createBuildCommand,
} from '@syner/cli/index';

import pkg from 'package.json'

const program = new Command();

program
  .name(pkg.name)
  .description(pkg.description)

// Top-level command: syner dev
program.addCommand(createDevCommand());
program.addCommand(createBuildCommand());

program.parse();
