/**
 * Agent Loop
 *
 * Implements the context → actions → checks pattern for Syner's agent loop.
 * Provides hooks for the AI SDK's step callbacks.
 */

import type { StepResult, ToolCallPart, Tool, TypedToolResult } from 'ai'
import { env } from '@syner/sdk'

/**
 * State tracked across agent loop iterations
 */
export interface LoopState {
  /** Total steps executed */
  stepCount: number
  /** Tool calls made */
  toolCalls: ToolCallPart[]
  /** Tool results received - typed properly for AI SDK v6 */
  toolResults: TypedToolResult<Record<string, Tool>>[]
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
  result: TypedToolResult<Record<string, Tool>>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for error results in the tool output
  // TypedToolResult has an 'output' field that contains the actual result
  if ('output' in result && result.output !== undefined) {
    const output = result.output
    if (typeof output === 'object' && output !== null) {
      const outputObj = output as Record<string, unknown>
      if (outputObj.error) {
        errors.push(`Tool ${toolName} returned error: ${outputObj.error}`)
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
        if (result.toolName === 'createSandbox' && 'output' in result && result.output !== undefined) {
          const output = result.output
          if (typeof output === 'object' && output !== null) {
            const outputObj = output as Record<string, unknown>
            if (outputObj.sandboxId) {
              state.sandboxId = outputObj.sandboxId as string
              if (verbose) {
                console.log(`[step ${state.stepCount}] Sandbox created: ${state.sandboxId}`)
              }
            }
          }
        }

        if (verbose) {
          console.log(`[step ${state.stepCount}] Tool result: ${result.toolName}`)
          // Truncate long results
          const resultOutput = 'output' in result ? result.output : undefined
          const resultStr = JSON.stringify(resultOutput) ?? 'undefined'
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
