import { Command } from 'commander';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function createBuildCommand() {
  const cmd = new Command('build');

  cmd
    .description('Generate Vercel Build Output (v3) for deployment')
    .option('--vercel', 'Emit .vercel/output (Build Output API v3)', true)
    .option('--verbose', 'Enable verbose logging')
    .action(async (options) => {
      if (!options.vercel) {
        if (options.verbose) console.log('Skipping Vercel Build Output emission');
        return;
      }

      const outDir = resolve(process.cwd(), '.vercel', 'output');
      const funcDir = resolve(outDir, 'functions', 'index.func');

      mkdirSync(funcDir, { recursive: true });

      // Minimal placeholder handler: Express app responding on any route
      const indexMjs = `import express from 'express';
const app = express();
app.use(express.json());
app.all('*', (req, res) => {
  res.json({ name: 'Syner OS', status: 'ok', route: req.originalUrl });
});
export default app;
`;
      writeFileSync(resolve(funcDir, 'index.mjs'), indexMjs, 'utf8');

      const vcConfig = {
        runtime: 'nodejs20.x',
        handler: 'index.mjs',
        launcherType: 'Nodejs',
        supportsResponseStreaming: true,
      } as const;
      writeFileSync(
        resolve(funcDir, '.vc-config.json'),
        JSON.stringify(vcConfig, null, 2),
        'utf8',
      );

      const rootConfig = { version: 3 } as const;
      writeFileSync(
        resolve(outDir, 'config.json'),
        JSON.stringify(rootConfig, null, 2),
        'utf8',
      );

      {
        const funcDirHealth = resolve(outDir, 'functions', 'api', 'health.func');
        mkdirSync(funcDirHealth, { recursive: true });

        const vcHealth = {
          runtime: 'nodejs20.x',
          handler: 'index.mjs',
          launcherType: 'Nodejs',
          supportsResponseStreaming: true,
        } as const;
        writeFileSync(
          resolve(funcDirHealth, '.vc-config.json'),
          JSON.stringify(vcHealth, null, 2),
          'utf8',
        );
      }

      if (options.verbose) {
        console.log('Vercel Build Output generated at .vercel/output');
        console.log('Function: functions/index.func (Node.js 20)');
        console.log('Function: functions/api/health.func (Node.js 20)');
      }
    });

  return cmd;
}


