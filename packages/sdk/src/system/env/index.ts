// TODO: move to synerops/protocol
import type { Sandbox } from '../sandbox/protocol';
import type { Env } from './protocol';

export const env: Env = {
  setSandbox: (sandbox: Sandbox) => {
    env.sandbox = sandbox;
  }
}

export type { Env } from './protocol';
