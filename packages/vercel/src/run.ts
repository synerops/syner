import {
  type Run,
  type RunAdapter,
  type RunRequest,
  type RunEvent,
  type Approval,
  type Cancel,
  createRun,
  updateRunStatus,
} from '@syner/osprotocol'
import { approvalToken, createAutoApproval, isQuorumMet } from './lib/approval'
import { resolveTimeoutAction, createTimeoutRace } from './lib/timeout'
import { computeDelay, shouldRetry } from './lib/retry'
import { checkBeforeCancel, gracefulTimeout } from './lib/cancel'
import { createProgressEvent } from './lib/progress'

export interface VercelRunAdapterConfig {
  /** Called when a run event occurs (status transitions) */
  onEvent?: (event: RunEvent) => void | Promise<void>
  /** Veto function for beforeCancel — return false to block cancellation */
  beforeCancel?: () => Promise<boolean>
  /** Number of approvals required for quorum (default: 1) */
  requiredApprovals?: number
}

/**
 * VercelRunAdapter implements OSProtocol RunAdapter over Vercel Workflow primitives.
 *
 * Currently provides the adapter logic layer (approval, timeout, retry, cancel).
 * Workflow runtime connection (start, createHook, etc.) will be wired
 * when `workflow` + `@workflow/ai` are installed (#559).
 */
export class VercelRunAdapter implements RunAdapter {
  private runs = new Map<string, Run>()
  private approvals = new Map<string, Approval[]>()
  private config: VercelRunAdapterConfig

  constructor(config: VercelRunAdapterConfig = {}) {
    this.config = config
  }

  async start(request: RunRequest): Promise<Run> {
    const id = crypto.randomUUID()
    const run = createRun({ id })

    this.runs.set(id, run)
    this.approvals.set(id, [])

    await this.emitEvent(run, 'pending', 'pending')

    // TODO: Wire to Workflow `start()` when deps are installed
    // const workflowRun = await start({ ... })

    return run
  }

  async get(id: string): Promise<Run> {
    const run = this.runs.get(id)
    if (!run) throw new Error(`Run not found: ${id}`)

    // TODO: Map Workflow internal state to OSProtocol RunStatus
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
      // Graceful: wait for timeout before forcing cancel
      await new Promise((resolve) => setTimeout(resolve, timeout))
    }

    const updated = updateRunStatus(run, 'cancelled')
    this.runs.set(id, { ...updated, cancel, completedAt: new Date().toISOString() })

    await this.emitEvent(run, run.status, 'cancelled')

    // TODO: Wire to Workflow `cancel()` when deps are installed
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

      // TODO: Wire to Workflow `resumeHook(token, approval)` when deps are installed
    }
  }

  private async emitEvent(run: Run, from: Run['status'], to: Run['status']): Promise<void> {
    if (!this.config.onEvent) return
    await this.config.onEvent({
      runId: run.id,
      from,
      to,
      timestamp: new Date().toISOString(),
    })
  }
}
