export interface Filesystem {
  readFile: (
    path: string,
    signal?: AbortSignal
  ) => Promise<null | ReadableStream>

  writeFiles: (
    files: Array<{ path: string; content: string }>,
    signal?: AbortSignal
  ) => Promise<void>
}

