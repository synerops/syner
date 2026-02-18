/**
 * Agent Loop
 *
 * Implements the context → actions → checks pattern for Syner's agent loop.
 * Provides hooks for the AI SDK's step callbacks.
 */

import type { StepResult, ToolCallPart, Tool } from 'ai'
import { env } from '@syner/sdk'

/**
 * State tracked across agent loop iterations
 */
export interface LoopState {
  /** Total steps executed */
  stepCount: number
  /** Tool calls made */
  toolCalls: ToolCallPart[]
  /** Tool results received - using any[] to avoid type conflicts */
  toolResults: any[]
  /** Timestamps for each step */
  timestamps: number[]
  /** Current sandbox ID if any */
  sandboxId: string | null
  /** Error messages if any */
  errors: string[]
}

/**
 * Context read from the current state
 */
export interface LoopContext {
  /** Current sandbox state */
  sandbox: ReturnType<typeof env.getSandbox>
  /** Loop state */
  state: LoopState
}

/**
 * Create a new loop state
 */
export function createLoopState(): LoopState {
  return {
    stepCount: 0,
    toolCalls: [],
    toolResults: [],
    timestamps: [],
    sandboxId: null,
    errors: [],
  }
}

/**
 * Read the current context
 * This is called at the start of each loop iteration
 */
export function readContext(state: LoopState): LoopContext {
  return {
    sandbox: env.getSandbox(),
    state,
  }
}

/**
 * Validate a tool result against rules
 * Returns validation result with any errors
 */
export function validateToolResult(
  toolName: string,
  result: any
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for error results  
  // ToolResultPart has a 'content' field that contains the actual result
  if ('content' in result && result.content) {
    const content = result.content
    if (Array.isArray(content)) {
      // Check if any content part indicates an error
      for (const part of content) {
        if (typeof part === 'object' && part !== null && 'error' in part) {
          errors.push(`Tool ${toolName} returned error: ${(part as any).error}`)
        }
      }
    } else if (typeof content === 'object' && content !== null) {
      // Single content object
      const contentObj = content as Record<string, unknown>
      if (contentObj.error) {
        errors.push(`Tool ${toolName} returned error: ${contentObj.error}`)
      }
    }
  }

  // TODO(@syner): Add rule-based validation from RULES.md
  // For now, we just check for obvious errors

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Create the onStepFinish callback for the AI SDK
 * This is called after each step in the agent loop
 */
export function createStepFinishHandler(
  state: LoopState,
  options: { verbose?: boolean } = {}
) {
  const { verbose = false } = options

  return async (step: StepResult<Record<string, Tool>>): Promise<void> => {
    state.stepCount++
    state.timestamps.push(Date.now())

    // Track tool calls
    if (step.toolCalls && step.toolCalls.length > 0) {
      for (const toolCall of step.toolCalls) {
        state.toolCalls.push(toolCall)

        if (verbose) {
          console.log(`[step ${state.stepCount}] Tool call: ${toolCall.toolName}`)
          // TypedToolCall might have 'input' or 'args' depending on the type
          const args = 'args' in toolCall ? toolCall.args : 'input' in toolCall ? toolCall.input : {}
          console.log(`  Args: ${JSON.stringify(args)}`)
        }
      }
    }

    // Track tool results
    if (step.toolResults && step.toolResults.length > 0) {
      for (const result of step.toolResults) {
        state.toolResults.push(result)

        // Validate result
        const validation = validateToolResult(result.toolName, result)
        if (!validation.valid) {
          state.errors.push(...validation.errors)
          if (verbose) {
            console.log(`[step ${state.stepCount}] Validation errors:`, validation.errors)
          }
        }

        // Update sandbox tracking
        if (result.toolName === 'createSandbox' && 'content' in result && result.content) {
          const content = result.content
          // Try to extract sandboxId from content
          if (Array.isArray(content) && content.length > 0) {
            const firstContent = content[0]
            if (typeof firstContent === 'object' && firstContent !== null) {
              const contentObj = firstContent as Record<string, unknown>
              if (contentObj.sandboxId) {
                state.sandboxId = contentObj.sandboxId as string
                if (verbose) {
                  console.log(`[step ${state.stepCount}] Sandbox created: ${state.sandboxId}`)
                }
              }
            }
          } else if (typeof content === 'object' && content !== null) {
            const contentObj = content as Record<string, unknown>
            if (contentObj.sandboxId) {
              state.sandboxId = contentObj.sandboxId as string
              if (verbose) {
                console.log(`[step ${state.stepCount}] Sandbox created: ${state.sandboxId}`)
              }
            }
          }
        }

        if (verbose) {
          console.log(`[step ${state.stepCount}] Tool result: ${result.toolName}`)
          // Truncate long results
          const resultContent = 'content' in result ? result.content : undefined
          const resultStr = JSON.stringify(resultContent) ?? 'undefined'
          console.log(
            `  Result: ${resultStr.length > 200 ? resultStr.slice(0, 200) + '...' : resultStr}`
          )
        }
      }
    }

    // Log text if present and verbose
    if (verbose && step.text) {
      console.log(`[step ${state.stepCount}] Text: ${step.text.slice(0, 100)}...`)
    }
  }
}

/**
 * Get a summary of the loop execution
 */
export function getLoopSummary(state: LoopState): {
  totalSteps: number
  totalToolCalls: number
  uniqueTools: string[]
  duration: number
  errors: string[]
  sandboxId: string | null
} {
  const uniqueTools = [...new Set(state.toolCalls.map((tc) => tc.toolName))]
  const duration =
    state.timestamps.length >= 2
      ? state.timestamps[state.timestamps.length - 1]! - state.timestamps[0]!
      : 0

  return {
    totalSteps: state.stepCount,
    totalToolCalls: state.toolCalls.length,
    uniqueTools,
    duration,
    errors: state.errors,
    sandboxId: state.sandboxId,
  }
}
