import type { Sandbox } from '../sandbox';

export interface Env {
  sandbox?: Sandbox | undefined;
  setSandbox: (sandbox: Sandbox) => void;
};
