/**
 * Execution Implementation
 *
 * Represents an active workflow execution with runtime control.
 * Implements the Execution interface from @osprotocol/schema.
 */

import type {
  Execution,
  ExecutionProgress,
  RunStatus,
  Approval,
} from '@osprotocol/schema/runs'

/**
 * SDK implementation of the Execution interface.
 *
 * Provides runtime control over an active workflow execution.
 *
 * @template Output - The type of result produced by the workflow
 */
export class ExecutionImpl<Output> implements Execution<Output> {
  readonly id: string
  status: RunStatus = 'in-progress'
  progress: ExecutionProgress = { current: 0, total: 1 }
  logs: string[] = []

  private _result: Promise<Output>
  private _resolve!: (value: Output) => void
  private _reject!: (error: Error) => void

  constructor(id: string) {
    this.id = id
    this._result = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  /**
   * The final result of the execution.
   * Resolves when the execution completes successfully.
   */
  get result(): Promise<Output> {
    return this._result
  }

  /**
   * Complete the execution with a result.
   * Called internally when the workflow finishes successfully.
   */
  complete(output: Output): void {
    this.status = 'completed'
    this.progress = { current: 1, total: 1, message: 'Completed' }
    this._resolve(output)
  }

  /**
   * Fail the execution with an error.
   * Called internally when the workflow fails.
   */
  fail(error: Error): void {
    this.status = 'failed'
    this.progress = { ...this.progress, message: `Failed: ${error.message}` }
    this._reject(error)
  }

  /**
   * Add a log entry.
   */
  log(message: string): void {
    this.logs.push(message)
  }

  /**
   * Update progress information.
   */
  updateProgress(current: number, total: number, message?: string): void {
    this.progress = { current, total, message }
  }

  // ==========================================================================
  // Execution Interface Methods
  // ==========================================================================

  /**
   * Cancel the execution.
   */
  async cancel(reason?: string): Promise<void> {
    this.status = 'cancelled'
    this.log(`Cancelled: ${reason ?? 'No reason provided'}`)
    this.progress = { ...this.progress, message: 'Cancelled' }
  }

  /**
   * Pause the execution.
   */
  async pause(): Promise<void> {
    this.status = 'awaiting'
    this.log('Paused')
    this.progress = { ...this.progress, message: 'Paused' }
  }

  /**
   * Resume a paused execution.
   */
  async resume(): Promise<void> {
    this.status = 'in-progress'
    this.log('Resumed')
    this.progress = { ...this.progress, message: 'Resumed' }
  }

  /**
   * Request human approval before continuing.
   */
  async waitForApproval(message?: string): Promise<Approval> {
    this.status = 'awaiting'
    this.log(`Waiting for approval: ${message ?? 'Approval required'}`)
    this.progress = { ...this.progress, message: 'Awaiting approval' }

    // Minimal implementation - auto-approve
    // Real implementations would integrate with approval systems
    return { approved: true, timestamp: new Date() }
  }

  /**
   * Request input from a human.
   */
  async waitForInput<Input>(_prompt: string): Promise<Input> {
    this.status = 'awaiting'
    throw new Error('waitForInput not implemented - requires UI integration')
  }
}
