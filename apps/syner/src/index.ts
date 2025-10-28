/**
 * Syner - The Orchestrator Agent
 * @implements @syner/sdk
 */

import { Command } from 'commander';
import express from 'express';

const program = new Command();

program
  .name('syner')
  .description('Syner OS - Agentic Operating System')
  .version('1.0.0');

program
  .command('dev')
  .description('Start development server')
  .action(() => {
    const app = express();
    
    app.listen(3005, () => {
      console.log(`Syner OS listening on port 3005`);
    });
  });

program.parse();

