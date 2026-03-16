import type { Run, Approval, Cancel } from '../schemas'
import type { RunRequest } from './run-request'

export interface RunAdapter {
  start(request: RunRequest): Promise<Run>
  get(id: string): Promise<Run>
  cancel(id: string, cancel?: Cancel): Promise<void>
  approve(id: string, approval: Approval): Promise<void>
}
