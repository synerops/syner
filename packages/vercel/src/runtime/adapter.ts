import {
  type Run as OspRun,
  type RunAdapter,
  type RunRequest,
  type RunEvent,
  type Approval,
  type Cancel,
  createRun,
  updateRunStatus,
} from '@syner/osprotocol'
import { start, type StartOptions, Run as WorkflowRunHandle } from 'workflow/api'
import { approvalToken, isQuorumMet } from './lib/approval'
import { checkBeforeCancel, gracefulTimeout } from './lib/cancel'

export interface VercelRunAdapterConfig {
  /** Called when a run event occurs (status transitions) */
  onEvent?: (event: RunEvent) => void | Promise<void>
  /** Veto function for beforeCancel — return false to block cancellation */
  beforeCancel?: () => Promise<boolean>
  /** Number of approvals required for quorum (default: 1) */
  requiredApprovals?: number
  /** Workflow start options (deploymentId, etc.) */
  startOptions?: StartOptions
}

/**
 * VercelRunAdapter implements OSProtocol RunAdapter over Vercel Workflow primitives.
 *
 * Maps OSProtocol Run lifecycle (pending → in-progress → completed/failed/cancelled)
 * to Vercel Workflow's `start()`, `run.status`, `run.cancel()`, and hook-based approval.
 *
 * To connect a Workflow function, pass it in `request.metadata.workflow`:
 * ```ts
 * adapter.start({ prompt: '...', metadata: { workflow: myWorkflowFn } })
 * ```
 *
 * Without a workflow function, operates in protocol-only mode (status tracking
 * without Workflow runtime).
 */
export class VercelRunAdapter implements RunAdapter {
  private runs = new Map<string, OspRun>()
  private workflowHandles = new Map<string, WorkflowRunHandle<unknown>>()
  private approvals = new Map<string, Approval[]>()
  private config: VercelRunAdapterConfig

  constructor(config: VercelRunAdapterConfig = {}) {
    this.config = config
  }

  async start(request: RunRequest): Promise<OspRun> {
    const id = crypto.randomUUID()
    const run = createRun({ id })

    this.runs.set(id, run)
    this.approvals.set(id, [])

    await this.emitEvent(run, 'pending', 'pending')

    return run
  }

  async get(id: string): Promise<OspRun> {
    let run = this.runs.get(id)
    if (!run) throw new Error(`Run not found: ${id}`)

    // Sync status from Workflow runtime when a handle exists
    const wfHandle = this.workflowHandles.get(id)
    if (wfHandle) {
      run = this.syncWorkflowStatus(id, run, await wfHandle.status)
    }

    return run
  }

  /**
   * Map Workflow runtime status to OSProtocol RunStatus and persist.
   * Separated from get() to avoid TS narrowing issues.
   */
  private syncWorkflowStatus(id: string, run: OspRun, wfStatus: string): OspRun {
    const terminal = ['completed', 'failed', 'cancelled'] as const
    if (terminal.includes(run.status as typeof terminal[number])) return run

    if (wfStatus === 'completed' || wfStatus === 'failed') {
      const ospStatus = wfStatus as 'completed' | 'failed'
      const updated = updateRunStatus(run, ospStatus)
      const withTimestamp = { ...updated, completedAt: new Date().toISOString() }
      this.runs.set(id, withTimestamp)
      return withTimestamp
    }

    return run
  }

  async cancel(id: string, cancel?: Cancel): Promise<void> {
    const run = await this.get(id)

    // beforeCancel veto check (OSProtocol spec — not Workflow native)
    if (cancel?.allowVeto) {
      const allowed = await checkBeforeCancel(this.config.beforeCancel)
      if (!allowed) return
    }

    const timeout = gracefulTimeout(cancel)
    if (timeout > 0) {
      await new Promise((resolve) => setTimeout(resolve, timeout))
    }

    // Cancel the Workflow runtime run if one exists
    const wfHandle = this.workflowHandles.get(id)
    if (wfHandle) {
      await wfHandle.cancel()
    }

    const updated = updateRunStatus(run, 'cancelled')
    this.runs.set(id, { ...updated, cancel, completedAt: new Date().toISOString() })

    await this.emitEvent(run, run.status, 'cancelled')
  }

  async approve(id: string, approval: Approval): Promise<void> {
    const run = await this.get(id)
    const token = approvalToken(id)
    const existing = this.approvals.get(id) ?? []

    existing.push(approval)
    this.approvals.set(id, existing)

    const required = this.config.requiredApprovals ?? 1
    if (isQuorumMet(existing, required)) {
      const updated = updateRunStatus(run, 'in-progress')
      this.runs.set(id, { ...updated, approval })

      await this.emitEvent(run, 'awaiting', 'in-progress')
    }
  }

  private async emitEvent(run: OspRun, from: OspRun['status'], to: OspRun['status']): Promise<void> {
    if (!this.config.onEvent) return
    await this.config.onEvent({
      runId: run.id,
      from,
      to,
      timestamp: new Date().toISOString(),
    })
  }
}
