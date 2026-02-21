/**
 * @syner/vercel - Vercel Integration
 *
 * Extends Syner OS with Vercel-specific capabilities:
 * - Sandbox: Ephemeral environments for code execution
 * - Deployments: Build status, logs, and deployment management
 */

// Sandbox
export { createSandbox, getSandbox, writeFiles, readFile, filesystem } from './system/sandbox'
export type { WriteFilesOptions, ReadFileOptions } from './system/sandbox'

// Deployments - Client functions (internal use)
export {
  createVercelClient,
  getDeploymentsByBranch,
  getFailedDeployments,
  getBuildLogs,
  getDeployment,
} from './deployments'

// Deployments - AI SDK Tools (agent use)
export {
  listDeployments,
  listFailedDeployments,
  buildLogs,
  deploymentInfo,
} from './deployments'

// Deployments - Types
export type {
  VercelClient,
  VercelClientConfig,
  VercelDeployment,
  DeploymentState,
  DeploymentEvent,
  DeploymentEventType,
  ListDeploymentsOptions,
  GetBuildLogsOptions,
  ListDeploymentsToolOptions,
  BuildLogsToolOptions,
} from './deployments'
