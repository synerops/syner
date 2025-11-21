export interface Sandbox {
  id: string
  status: "pending" | "running" | "stopping" | "stopped" | "failed"
  timeout: number

  readFile: (
    path: string,
    signal?: AbortSignal
  ) => Promise<null | ReadableStream>

  writeFiles: (
    files: Array<{ path: string; content: string }>,
    signal?: AbortSignal
  ) => Promise<void>
}
