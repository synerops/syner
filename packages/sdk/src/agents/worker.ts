import { 
  Experimental_Agent as Agent, 
} from "ai"
import type {
  Experimental_AgentSettings as AgentSettings,
  ToolSet,
  GenerateTextResult,
} from "ai"
import type { PlanStep } from "./planner"

export type WorkerTools = ToolSet

export interface ExecutionResult {
  success: boolean
  output?: unknown
  error?: string
  toolCalls?: Array<{
    id: string
    name: string
    input: unknown
    needsApproval?: boolean
  }>
}

export interface WorkerOutput {
  result: ExecutionResult
}

export type WorkerSettings = AgentSettings<
  WorkerTools, 
  WorkerOutput
>

/**
 * Worker Agent - Executes individual plan steps
 * 
 * The Worker is responsible for carrying out plan steps by:
 * - Using actions/ APIs to perform operations
 * - Tracking tool calls that require approval
 * - Returning execution results for verification
 */
export interface WorkerContract {
  execute(step: PlanStep): Promise<ExecutionResult>
}

export class Worker extends Agent<
  WorkerTools, 
  WorkerOutput
> implements WorkerContract {
  constructor(options: WorkerSettings) {
    super(options)
  }

  async execute(step: PlanStep): Promise<ExecutionResult> {
    try {
      // Generate execution using the step's action and description
      const result = await this.generate({
        prompt: `Execute the following task:
        
Task: ${step.description}
Action: ${step.action}
Expected Outcome: ${step.expectedOutcome}

Please execute this task and report the results.`,
      })

      // Extract tool calls from the result
      const toolCalls = result.toolCalls?.map(tc => ({
        id: tc.toolCallId,
        name: tc.toolName,
        input: tc.args,
        // Check if tool has needsApproval flag
        needsApproval: (tc as any).needsApproval ?? false,
      })) ?? []

      return {
        success: true,
        output: result.output,
        toolCalls,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
}

