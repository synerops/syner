import { run } from "syner"
import { startWorkflow } from "./workflows"

const execution = await run({
  workflow: startWorkflow,
  timeout: {
    duration: 60000, // 1 minute
    onTimeout: () => console.log("Workflow timed out")
  },
  retry: {
    attempts: 3,
    waitFor: 1000,
    onRetry: (error) => console.log(`Workflow failed with error: ${error.message}`)
  },
  cancel: {
    beforeCancel: () => console.log("Workflow about to be cancelled"),
    afterCancel: () => console.log("Workflow cancelled")
  },
})

// actions
interface Execution {
  cancel(reason?: string): Promise<void> // mark the execution as cancelled
  pause(): Promise<void> // mark the execution as awaiting
  resume(): Promise<void> // mark the execution as in-progress
  waitForApproval(message?: string): Promise<void>
  waitForInput(prompt: string, schema?: any): Promise<any>
  status: string,
  progress: { current: number, total: number },
  logs: string[],
  result: Promise<any>
}

const { approve } = execution.waitForApproval(
  "Please approve the workflow"
)
