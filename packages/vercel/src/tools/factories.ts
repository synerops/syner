/**
 * Syner Tools — the interface layer.
 *
 * Each export is a factory: takes ensureSandbox (lazy), returns a Tool.
 * Vercel provides the implementation, syner names and registers.
 *
 * Usage in runtime:
 *   const tools = {
 *     Read: Read(ensureSandbox),
 *     Write: Write(ensureSandbox),
 *     Glob: Glob(ensureSandbox),
 *     Grep: Grep(ensureSandbox),
 *     Bash: Bash(ensureSandbox),
 *     Fetch: Fetch(),
 *   }
 */

import { tool } from 'ai'
import type { Sandbox } from '@vercel/sandbox'
import {
  readInputSchema, type ReadInput, executeRead,
  writeInputSchema, type WriteInput, executeWrite,
  globInputSchema, type GlobInput, executeGlob,
  grepInputSchema, type GrepInput, executeGrep,
  bashInputSchema, type BashInput, executeBash,
  fetchInputSchema, type FetchInput, executeFetch,
} from './index'

type EnsureSandbox = () => Promise<Sandbox>

export function Read(ensureSandbox: EnsureSandbox) {
  return tool({
    description: 'Read a file from the filesystem',
    inputSchema: readInputSchema,
    execute: async (input) => {
      const sb = await ensureSandbox()
      return executeRead(sb, input as ReadInput)
    },
  })
}

export function Write(ensureSandbox: EnsureSandbox) {
  return tool({
    description: 'Write content to a file (creates parent directories if needed)',
    inputSchema: writeInputSchema,
    execute: async (input) => {
      const sb = await ensureSandbox()
      return executeWrite(sb, input as WriteInput)
    },
  })
}

export function Glob(ensureSandbox: EnsureSandbox) {
  return tool({
    description: 'Find files matching a glob pattern',
    inputSchema: globInputSchema,
    execute: async (input) => {
      const sb = await ensureSandbox()
      return executeGlob(sb, input as GlobInput)
    },
  })
}

export function Grep(ensureSandbox: EnsureSandbox) {
  return tool({
    description: 'Search file contents with regex',
    inputSchema: grepInputSchema,
    execute: async (input) => {
      const sb = await ensureSandbox()
      return executeGrep(sb, input as GrepInput)
    },
  })
}

export function Bash(ensureSandbox: EnsureSandbox) {
  return tool({
    description: 'Execute a command in the sandbox shell',
    inputSchema: bashInputSchema,
    execute: async (input) => {
      const sb = await ensureSandbox()
      return executeBash(sb, input as BashInput)
    },
  })
}

export function Fetch() {
  return tool({
    description: 'Fetch URL content as markdown (truncated to 50k chars)',
    inputSchema: fetchInputSchema,
    execute: (input) => executeFetch(input as FetchInput),
  })
}
