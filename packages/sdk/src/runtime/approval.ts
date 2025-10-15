/**
 * Approval Runtime - Tool Execution Approval Control Flow
 * 
 * Manages the approval workflow for tools that require human confirmation
 * before execution. This is a control flow mechanism similar to timeout,
 * cancel, and retries.
 */

export type ApprovalStatus = 'pending' | 'approved' | 'denied' | 'unknown'
export type ApprovalDecision = 'approved' | 'denied'

export interface ToolApproval {
  toolCallId: string
  toolName: string
  input: unknown
  timestamp: Date
  status: ApprovalStatus
}

export interface ApprovalConfig {
  /**
   * Callback when approval is required
   */
  onApprovalRequired?: (pending: ToolApproval[]) => Promise<void> | void
  
  /**
   * Timeout for waiting for approval (in ms)
   * If timeout is reached, the approval is auto-denied
   */
  timeout?: number
}

/**
 * In-memory store for pending approvals
 */
class ApprovalStore {
  private approvals = new Map<string, ToolApproval>()
  private resolvers = new Map<string, (decision: ApprovalDecision) => void>()

  add(toolCallId: string, toolName: string, input: unknown): void {
    this.approvals.set(toolCallId, {
      toolCallId,
      toolName,
      input,
      timestamp: new Date(),
      status: 'pending',
    })
  }

  resolve(toolCallId: string, decision: ApprovalDecision): void {
    const approval = this.approvals.get(toolCallId)
    if (approval) {
      approval.status = decision
      const resolver = this.resolvers.get(toolCallId)
      if (resolver) {
        resolver(decision)
        this.resolvers.delete(toolCallId)
      }
    }
  }

  registerResolver(toolCallId: string, resolver: (decision: ApprovalDecision) => void): void {
    this.resolvers.set(toolCallId, resolver)
  }

  get(toolCallId: string): ToolApproval | undefined {
    return this.approvals.get(toolCallId)
  }

  getPending(): ToolApproval[] {
    return Array.from(this.approvals.values()).filter(a => a.status === 'pending')
  }

  getStatus(toolCallId: string): ApprovalStatus {
    return this.approvals.get(toolCallId)?.status ?? 'unknown'
  }

  clear(): void {
    this.approvals.clear()
    this.resolvers.clear()
  }
}

const store = new ApprovalStore()

/**
 * Wait for approval of a tool call
 * 
 * This function pauses execution until the tool call is approved or denied.
 * It implements the "human-in-the-loop" pattern from Anthropic's agentic architecture.
 * 
 * @param toolCallId - Unique identifier for the tool call
 * @param toolName - Name of the tool requiring approval
 * @param input - Input arguments for the tool
 * @param config - Approval configuration
 * @returns Promise that resolves to the approval decision
 */
export async function waitForApproval(
  toolCallId: string,
  toolName: string,
  input: unknown,
  config?: ApprovalConfig
): Promise<ApprovalDecision> {
  // Add to pending approvals
  store.add(toolCallId, toolName, input)

  // Trigger callback if provided
  if (config?.onApprovalRequired) {
    await config.onApprovalRequired(store.getPending())
  }

  // Wait for approval/denial
  return new Promise<ApprovalDecision>((resolve) => {
    store.registerResolver(toolCallId, resolve)

    // Handle timeout if specified
    if (config?.timeout) {
      setTimeout(() => {
        if (store.getStatus(toolCallId) === 'pending') {
          store.resolve(toolCallId, 'denied')
        }
      }, config.timeout)
    }
  })
}

/**
 * Grant approval for a tool call
 */
export function grant(toolCallId: string): void {
  store.resolve(toolCallId, 'approved')
}

/**
 * Deny approval for a tool call
 */
export function deny(toolCallId: string): void {
  store.resolve(toolCallId, 'denied')
}

/**
 * Get all pending approvals
 */
export function getPending(): ToolApproval[] {
  return store.getPending()
}

/**
 * Get status of a specific tool call
 */
export function getStatus(toolCallId: string): ApprovalStatus {
  return store.getStatus(toolCallId)
}

/**
 * Clear all approvals (useful for testing or reset)
 */
export function clearAll(): void {
  store.clear()
}

/**
 * Approval API
 */
export const approval = {
  waitForApproval,
  grant,
  deny,
  getPending,
  getStatus,
  clearAll,
}

