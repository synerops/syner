import type { Sandbox } from '../sandbox';
import type { CreateSandboxOptions } from '../sandbox';

export interface Env {
  sandbox?: Sandbox | undefined;
  setSandbox: (sandbox: Sandbox) => void;
  createSandbox: (options?: CreateSandboxOptions) => Promise<Sandbox>;
  getSandbox: () => Sandbox | null;
};
