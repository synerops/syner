/**
 * @syner/vercel type declarations
 */

import type { Tool } from 'ai'
import type { CreateSandboxOptions, Sandbox, Filesystem } from '@syner/sdk'

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
