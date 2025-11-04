import type { Agent } from '@syner/sdk';

export interface ServerConfig {
  port: number;
  agents: Agent[];
  development?: boolean;
}

export interface ServerInstance {
  url: URL;
  port: number;
  hostname: string;
  stop(closeActiveConnections?: boolean): Promise<void>;
  reload(options: any): void;
}

