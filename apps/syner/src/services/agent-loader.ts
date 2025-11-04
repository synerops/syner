import { AgentRegistry, loadConfig, resolveConfigDirectory } from '@syner/sdk';
import type { Agent, Config } from '@syner/sdk';

export interface AgentLoadResult {
  agents: Agent[];
  config: Config;
  agentsDir: string;
}

export async function loadAgents(configPath: string): Promise<AgentLoadResult> {
  const config = await loadConfig(configPath);
  console.log(`📋 Loaded config from ${configPath}`);

  const agentsDir = resolveConfigDirectory(config);
  console.log(`🔍 Discovering agents in ${agentsDir}`);

  const registry = new AgentRegistry();
  const agents = await registry.discover(agentsDir, {
    patterns: config.patterns,
    exclude: config.exclude,
  });

  if (agents.length === 0) {
    console.log(`⚠️  No agents found in ${agentsDir}`);
  } else {
    console.log(`✓ Discovered ${agents.length} agent${agents.length !== 1 ? 's' : ''}`);
    agents.forEach((agent: Agent) => {
      console.log(`  - ${agent.name}`);
    });
  }

  return { agents, config, agentsDir };
}

