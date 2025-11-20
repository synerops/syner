/**
 * Sandbox Protocol
 * 
 * Vendor-agnostic contract for sandbox execution.
 * Implementations are provided by extensions (e.g., @syner/vercel).
 */

export type {
  Sandbox,
  SandboxOptions,
  RunCommandOptions,
  RunCommandResult,
} from './protocol';

export {
  SandboxOptionsSchema,
} from './protocol';

