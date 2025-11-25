import type { Readable } from 'stream'

/**
 * Filesystem protocol interface
 * 
 * Supports both Web API ReadableStream and Node.js Readable streams
 * to accommodate different sandbox implementations.
 */
export interface Filesystem {
  readFile: (
    path: string,
    signal?: AbortSignal
  ) => Promise<null | ReadableStream<any> | Readable>

  writeFiles: (
    files: Array<{ path: string; content: string }>,
    signal?: AbortSignal
  ) => Promise<void>
}
