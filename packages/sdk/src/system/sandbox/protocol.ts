export interface Sandbox {
  id: string
  status: "pending" | "running" | "stopping" | "stopped" | "failed"
  timeout: number
}
