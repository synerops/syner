import type {
  Sandbox,
  CreateSandboxOptions,
} from './sandbox';

export interface Env {
  // sandbox
  sandbox?: Sandbox | undefined;
  setSandbox: (sandbox: Sandbox) => void;
  getSandbox: () => Sandbox | null;
  createSandbox?: (options?: CreateSandboxOptions) => Promise<Sandbox>;
};
