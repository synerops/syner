/**
 * Sandbox file operations tools
 */

import { tool } from 'ai'
import { z } from 'zod'
import { Sandbox as VercelSandbox } from '@vercel/sandbox'

import type { Filesystem } from '@syner/sdk'
import type { Readable } from 'stream'
import { getSandbox } from './create'

export type WriteFilesOptions = {
  signal?: AbortSignal
}

export type ReadFileOptions = {
  cwd?: string
  signal?: AbortSignal
}

/**
 * Implementation of Filesystem interface using Vercel Sandbox
 */
class VercelFilesystem implements Filesystem {
  async readFile(path: string, signal?: AbortSignal): Promise<null | ReadableStream<unknown> | Readable> {
    const sandbox = getSandbox()

    if (!sandbox) {
      throw new Error('No active sandbox found. Create a sandbox first using createSandbox tool.')
    }

    if (sandbox.status !== 'running' && sandbox.status !== 'pending') {
      throw new Error(`Sandbox is not active. Current status: ${sandbox.status}`)
    }

    if (signal?.aborted) {
      throw new Error('readFile operation was aborted')
    }

    try {
      const vercelSandbox = await VercelSandbox.get({ sandboxId: sandbox.id, signal })
      const nodeStream = await vercelSandbox.readFile({ path }, { signal })
      return nodeStream as Readable | null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to read file from sandbox: ${errorMessage}`)
    }
  }

  async writeFiles(files: Array<{ path: string; content: string }>, signal?: AbortSignal): Promise<void> {
    const sandbox = getSandbox()

    if (!sandbox) {
      throw new Error('No active sandbox found. Create a sandbox first using createSandbox tool.')
    }

    if (sandbox.status !== 'running' && sandbox.status !== 'pending') {
      throw new Error(`Sandbox is not active. Current status: ${sandbox.status}`)
    }

    if (signal?.aborted) {
      throw new Error('writeFiles operation was aborted')
    }

    try {
      const vercelSandbox = await VercelSandbox.get({ sandboxId: sandbox.id, signal })

      const vercelFiles = files.map((file) => ({
        path: file.path,
        content: Buffer.from(file.content, 'utf-8'),
      }))

      await vercelSandbox.writeFiles(vercelFiles, { signal })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to write files to sandbox: ${errorMessage}`)
    }
  }
}

export const filesystem: Filesystem = new VercelFilesystem()

// Tool parameter schemas
const writeFilesInputSchema = z.object({
  files: z
    .array(
      z.object({
        path: z.string().describe('Path to the file. Relative paths are written to /vercel/sandbox'),
        content: z.string().describe('File content as a string'),
      })
    )
    .min(1)
    .describe('Array of files to write with their paths and contents'),
})

const readFileInputSchema = z.object({
  path: z.string().describe('Path to the file to read. Can be relative to /vercel/sandbox or absolute'),
})

// Result types
type WriteFilesResult = {
  message: string
  files: Array<{ path: string; size: number }>
}

type ReadFileResult =
  | { message: string; path: string; exists: true; content: string; size: number }
  | { message: string; path: string; exists: false; content: null }

/**
 * Tool to write files to the sandbox filesystem
 */
export const writeFiles = (options: WriteFilesOptions = {}) =>
  tool({
    description: `Write one or more files to the sandbox filesystem.
Files are written to /vercel/sandbox unless an absolute path is specified.`,
    inputSchema: writeFilesInputSchema,
    execute: async (args: z.infer<typeof writeFilesInputSchema>): Promise<WriteFilesResult> => {
      console.log('═══════════════════════════════════════════════════════════')
      console.log('[TOOL] TOOL CALL START - writeFiles')
      console.log('═══════════════════════════════════════════════════════════')
      try {
        console.log('[writeFiles] Writing files to sandbox:', { fileCount: args.files.length })

        await filesystem.writeFiles(args.files, options.signal)

        const result: WriteFilesResult = {
          message: `Successfully wrote ${args.files.length} file(s) to sandbox`,
          files: args.files.map((f) => ({
            path: f.path,
            size: Buffer.byteLength(f.content, 'utf-8'),
          })),
        }

        console.log('[writeFiles] Files written successfully:', result)
        console.log('═══════════════════════════════════════════════════════════')
        console.log('[TOOL] TOOL CALL END - writeFiles')
        console.log('═══════════════════════════════════════════════════════════')
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('[writeFiles] Error:', errorMessage)
        console.log('═══════════════════════════════════════════════════════════')
        console.log('[TOOL] TOOL CALL END - writeFiles (ERROR)')
        console.log('═══════════════════════════════════════════════════════════')
        throw new Error(`Failed to write files: ${errorMessage}`)
      }
    },
  })

/**
 * Tool to read a file from the sandbox filesystem
 */
export const readFile = (options: ReadFileOptions = {}) =>
  tool({
    description:
      "Read a file from the sandbox filesystem. Returns the file content as a string, or indicates if the file doesn't exist.",
    inputSchema: readFileInputSchema,
    execute: async (args: z.infer<typeof readFileInputSchema>): Promise<ReadFileResult> => {
      console.log('═══════════════════════════════════════════════════════════')
      console.log('[TOOL] TOOL CALL START - readFile')
      console.log('═══════════════════════════════════════════════════════════')
      try {
        console.log('[readFile] Reading file from sandbox:', { path: args.path, cwd: options.cwd })

        const sandbox = getSandbox()
        if (!sandbox) {
          throw new Error('No active sandbox found. Create a sandbox first using createSandbox tool.')
        }

        if (sandbox.status !== 'running' && sandbox.status !== 'pending') {
          throw new Error(`Sandbox is not active. Current status: ${sandbox.status}`)
        }

        if (options.signal?.aborted) {
          throw new Error('readFile operation was aborted')
        }

        const vercelSandbox = await VercelSandbox.get({ sandboxId: sandbox.id, signal: options.signal })
        const nodeStream = await vercelSandbox.readFile({ path: args.path }, { signal: options.signal })

        if (!nodeStream) {
          console.log('[readFile] Stream is null, file not found')
          console.log('═══════════════════════════════════════════════════════════')
          console.log('[TOOL] TOOL CALL END - readFile')
          console.log('═══════════════════════════════════════════════════════════')
          return {
            message: `File not found: ${args.path}`,
            path: args.path,
            exists: false,
            content: null,
          }
        }

        const chunks: Buffer[] = []

        for await (const chunk of nodeStream) {
          if (options.signal?.aborted) {
            throw new Error('readFile operation was aborted during stream reading')
          }
          chunks.push(Buffer.from(chunk))
        }

        const content = Buffer.concat(chunks).toString('utf-8')

        const result: ReadFileResult = {
          message: `File read successfully: ${args.path}`,
          path: args.path,
          exists: true,
          content,
          size: Buffer.byteLength(content, 'utf-8'),
        }

        console.log('[readFile] File read successfully:', { path: args.path, size: result.size })
        console.log('[readFile] File content:', result.content)
        console.log('═══════════════════════════════════════════════════════════')
        console.log('[TOOL] TOOL CALL END - readFile')
        console.log('═══════════════════════════════════════════════════════════')
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('[readFile] Error:', errorMessage)
        console.log('═══════════════════════════════════════════════════════════')
        console.log('[TOOL] TOOL CALL END - readFile (ERROR)')
        console.log('═══════════════════════════════════════════════════════════')
        throw new Error(`Failed to read file: ${errorMessage}`)
      }
    },
  })
