export interface Sandbox {
  id: string
  status: "pending" | "running" | "stopping" | "stopped" | "failed" | "snapshotting"
  timeout: number
}

export type CreateSandboxOptions = {
  source?:
    | {
        type: "git"
        url: string
        depth?: number
        revision?: string
      }
    | {
        type: "git"
        url: string
        username: string
        password: string
        depth?: number
        revision?: string
      }
    | {
        type: "tarball"
        url: string
      }
  ports?: number[]
  timeout?: number
  resources?: {
    vcpus: number
  }
  runtime?: string | "node22" | "python3.13"
  signal?: AbortSignal
}
