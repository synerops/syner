/**
 * syner - The Orchestrator Agent
 * @implements @syner/sdk
 */

import { Command } from 'commander';
import express from 'express';
import { name, description, version } from '../package.json';

const program = new Command();

program
  .name(name)
  .description(description)
  .version(version);

program
  .command('dev')
  .description('Start development server')
  .action(() => {
    const app = express();
    
    app.listen(3005, () => {
      console.log(`syner OS listening on port 3005`);
    });
  });

program.parse();

