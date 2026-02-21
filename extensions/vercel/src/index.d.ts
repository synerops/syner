/**
 * @syner/vercel type declarations
 */

import type { Tool } from 'ai'
import type { CreateSandboxOptions, Sandbox, Filesystem } from '@syner/sdk'

// Sandbox types
export interface WriteFilesOptions {
  signal?: AbortSignal
}

export interface ReadFileOptions {
  cwd?: string
  signal?: AbortSignal
}

export declare function createSandbox(options?: CreateSandboxOptions): Tool
export declare function getSandbox(): Sandbox | null
export declare function writeFiles(options?: WriteFilesOptions): Tool
export declare function readFile(options?: ReadFileOptions): Tool
export declare const filesystem: Filesystem

// Deployment types
export type DeploymentState = 'BUILDING' | 'ERROR' | 'READY' | 'QUEUED' | 'CANCELED' | 'INITIALIZING'
export type DeploymentEventType = 'build' | 'error' | 'warning' | 'info'

export interface VercelDeployment {
  uid: string
  name: string
  url: string | null
  state: DeploymentState
  readyState: DeploymentState
  branch: string | null
  sha: string | null
  errorCode?: string
  errorMessage?: string
  created: number
  buildingAt?: number
  ready?: number
  projectId: string
  target: 'production' | 'preview' | null
  creator: {
    uid: string
    username: string
  }
}

export interface DeploymentEvent {
  type: DeploymentEventType
  created: number
  payload: {
    text?: string
    deploymentId?: string
    statusCode?: number
    info?: {
      type?: string
      name?: string
      entrypoint?: string
      readyState?: string
    }
  }
}

export interface VercelClientConfig {
  token: string
  teamId?: string
}

export interface VercelClient {
  token: string
  teamId?: string
  baseUrl: string
}

export interface ListDeploymentsOptions {
  projectId: string
  branch?: string
  sha?: string
  state?: DeploymentState
  target?: 'production' | 'preview'
  limit?: number
}

export interface GetBuildLogsOptions {
  limit?: number
  since?: number
  until?: number
  direction?: 'forward' | 'backward'
}

// Deployment client functions (internal use)
export declare function createVercelClient(config: VercelClientConfig): VercelClient
export declare function getDeploymentsByBranch(
  client: VercelClient,
  options: ListDeploymentsOptions
): Promise<VercelDeployment[]>
export declare function getFailedDeployments(
  client: VercelClient,
  options: Omit<ListDeploymentsOptions, 'state'>
): Promise<VercelDeployment[]>
export declare function getBuildLogs(
  client: VercelClient,
  deploymentId: string,
  options?: GetBuildLogsOptions
): Promise<DeploymentEvent[]>
export declare function getDeployment(
  client: VercelClient,
  deploymentId: string
): Promise<VercelDeployment>

// Deployment tool options
export interface ListDeploymentsToolOptions {
  token: string
  teamId?: string
}

export interface BuildLogsToolOptions {
  token: string
  teamId?: string
}

// Deployment AI SDK tools (agent use)
export declare function listDeployments(options: ListDeploymentsToolOptions): Tool
export declare function listFailedDeployments(options: ListDeploymentsToolOptions): Tool
export declare function buildLogs(options: BuildLogsToolOptions): Tool
export declare function deploymentInfo(options: BuildLogsToolOptions): Tool
