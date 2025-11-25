import { tool } from "ai"
import { z } from "zod"
import { Sandbox as VercelSandbox } from "@vercel/sandbox"

import type { Filesystem } from "@syner/sdk"
import type { Readable } from 'stream'
import { getSandbox } from './env'

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
  async readFile(
    path: string,
    signal?: AbortSignal
  ): Promise<null | ReadableStream<any> | Readable> {
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
      // Vercel Sandbox returns a Node.js Readable stream
      const nodeStream = await vercelSandbox.readFile({ path }, { signal })
      return nodeStream as Readable | null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to read file from sandbox: ${errorMessage}`)
    }
  }

  async writeFiles(
    files: Array<{ path: string; content: string }>,
    signal?: AbortSignal
  ): Promise<void> {
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

      // Convert string content to Buffer as required by Vercel Sandbox
      const vercelFiles = files.map(file => ({
        path: file.path,
        content: Buffer.from(file.content, 'utf-8')
      }))

      await vercelSandbox.writeFiles(vercelFiles, { signal })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to write files to sandbox: ${errorMessage}`)
    }
  }
}

// Export singleton instance
export const filesystem: Filesystem = new VercelFilesystem()

/**
 * Tool to write files to the sandbox filesystem
 *
 * This tool wraps the Filesystem interface implementation and adapts it
 * for use by LLM agents (returns serializable JSON).
 */
export const writeFiles = (options: WriteFilesOptions = {}) =>
  tool({
    description: `Write one or more files to the sandbox filesystem.
    Files are written to /vercel/sandbox unless an absolute path is specified.`,
    inputSchema: z.object({
      files: z.array(
        z.object({
          path: z
            .string()
            .describe("Path to the file. Relative paths are written to /vercel/sandbox"),
          content: z
            .string()
            .describe("File content as a string")
        })
      ).min(1).describe("Array of files to write with their paths and contents")
    }),
    execute: async ({ files }) => {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('[TOOL] TOOL CALL START - writeFiles');
      console.log('═══════════════════════════════════════════════════════════');
      try {
        console.log('[writeFiles] Writing files to sandbox:', { fileCount: files.length })

        await filesystem.writeFiles(files, options.signal)

        const result = {
          message: `Successfully wrote ${files.length} file(s) to sandbox`,
          files: files.map(f => ({
            path: f.path,
            size: Buffer.byteLength(f.content, 'utf-8')
          }))
        }

        console.log('[writeFiles] Files written successfully:', result)
        console.log('═══════════════════════════════════════════════════════════');
        console.log('[TOOL] TOOL CALL END - writeFiles');
        console.log('═══════════════════════════════════════════════════════════');
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('[writeFiles] Error:', errorMessage)
        console.log('═══════════════════════════════════════════════════════════');
        console.log('[TOOL] TOOL CALL END - writeFiles (ERROR)');
        console.log('═══════════════════════════════════════════════════════════');
        throw new Error(`Failed to write files: ${errorMessage}`)
      }
    }
  })

/**
 * Tool to read a file from the sandbox filesystem
 *
 * This tool wraps the Filesystem interface implementation and adapts it
 * for use by LLM agents (consumes stream and returns serializable JSON).
 */
export const readFile = (options: ReadFileOptions = {}) =>
  tool({
    description: "Read a file from the sandbox filesystem. Returns the file content as a string, or indicates if the file doesn't exist.",
    inputSchema: z.object({
      path: z
        .string()
        .describe("Path to the file to read. Can be relative to /vercel/sandbox or absolute")
    }),
    execute: async ({ path }) => {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('[TOOL] TOOL CALL START - readFile');
      console.log('═══════════════════════════════════════════════════════════');
      try {
        console.log('[readFile] Reading file from sandbox:', { path, cwd: options.cwd })

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

        // Call Vercel Sandbox directly - it returns a Node.js Readable stream
        const vercelSandbox = await VercelSandbox.get({ sandboxId: sandbox.id, signal: options.signal })
        const nodeStream = await vercelSandbox.readFile({ path }, { signal: options.signal })

        if (!nodeStream) {
          console.log('[readFile] Stream is null, file not found')
          console.log('═══════════════════════════════════════════════════════════');
          console.log('[TOOL] TOOL CALL END - readFile');
          console.log('═══════════════════════════════════════════════════════════');
          return {
            message: `File not found: ${path}`,
            path,
            exists: false,
            content: null
          }
        }

        // Read from Node.js Readable stream directly
        const chunks: Buffer[] = []
        
        for await (const chunk of nodeStream) {
          if (options.signal?.aborted) {
            throw new Error('readFile operation was aborted during stream reading')
          }
          chunks.push(Buffer.from(chunk))
        }

        const content = Buffer.concat(chunks).toString('utf-8')

        const result = {
          message: `File read successfully: ${path}`,
          path,
          exists: true,
          content,
          size: Buffer.byteLength(content, 'utf-8')
        }

        console.log('[readFile] File read successfully:', { path, size: result.size })
        console.log('[readFile] File content:', result.content)
        console.log('═══════════════════════════════════════════════════════════');
        console.log('[TOOL] TOOL CALL END - readFile');
        console.log('═══════════════════════════════════════════════════════════');
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('[readFile] Error:', errorMessage)
        console.log('═══════════════════════════════════════════════════════════');
        console.log('[TOOL] TOOL CALL END - readFile (ERROR)');
        console.log('═══════════════════════════════════════════════════════════');
        throw new Error(`Failed to read file: ${errorMessage}`)
      }
    }
  })
