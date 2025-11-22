import { tool } from "ai"
import { z } from "zod"
import { Sandbox as VercelSandbox } from "@vercel/sandbox"

import type { Filesystem } from "@syner/sdk"
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
  ): Promise<null | ReadableStream> {
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
      const stream = await vercelSandbox.readFile({ path }, { signal })
      return stream
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
    description: "Write one or more files to the sandbox filesystem. Files are written to /vercel/sandbox unless an absolute path is specified.",
    inputSchema: z.object({
      files: z.array(
        z.object({
          path: z.string().describe("Path to the file. Relative paths are written to /vercel/sandbox"),
          content: z.string().describe("File content as a string")
        })
      ).min(1).describe("Array of files to write with their paths and contents")
    }),
    execute: async ({ files }) => {
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
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('[writeFiles] Error:', errorMessage)
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
      path: z.string().describe("Path to the file to read. Can be relative to /vercel/sandbox or absolute")
    }),
    execute: async ({ path }) => {
      try {
        console.log('[readFile] Reading file from sandbox:', { path, cwd: options.cwd })

        const stream = await filesystem.readFile(path, options.signal)

        if (!stream) {
          return {
            message: `File not found: ${path}`,
            path,
            exists: false,
            content: null
          }
        }

        // Convert ReadableStream to string for serializable tool response
        const reader = stream.getReader()
        const decoder = new TextDecoder('utf-8')
        let content = ''
        
        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (options.signal?.aborted) {
              reader.cancel()
              throw new Error('readFile operation was aborted during stream reading')
            }
            
            if (done) break
            
            content += decoder.decode(value, { stream: true })
          }
          
          // Decode any remaining bytes
          content += decoder.decode()
        } finally {
          reader.releaseLock()
        }

        const result = {
          message: `File read successfully: ${path}`,
          path,
          exists: true,
          content,
          size: Buffer.byteLength(content, 'utf-8')
        }

        console.log('[readFile] File read successfully:', { path, size: result.size })
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('[readFile] Error:', errorMessage)
        throw new Error(`Failed to read file: ${errorMessage}`)
      }
    }
  })

