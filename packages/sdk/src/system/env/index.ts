// TODO: move to synerops/protocol
import type { Sandbox } from './sandbox';
import type { Env } from './protocol';

export const env: Env = {
  setSandbox: (sandbox: Sandbox) => {
    env.sandbox = sandbox;
  },

  getSandbox: (): Sandbox | null => {
    return env.sandbox ?? null;
  }
}

export type { Env } from './protocol';
