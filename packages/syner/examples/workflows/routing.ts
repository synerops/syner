/**
 * Routing Workflow Example
 *
 * Shows how to use Routing workflow to classify and execute specialized workflows.
 * Run: bun run examples/workflows/routing.ts
 */

import { Routing } from '../../src'
import type { Workflow } from '@syner/sdk'

// Define specialized workflows
const supportWorkflow: Workflow<string> = {
  run: async (prompt: string) => {
    return `[Support] Handling: ${prompt}`
  },
}

const billingWorkflow: Workflow<string> = {
  run: async (prompt: string) => {
    return `[Billing] Processing: ${prompt}`
  },
}

async function main() {
  const routing = new Routing({
    model: 'anthropic/claude-haiku-4.5',
    workflows: {
      support: {
        workflow: supportWorkflow,
        description: 'Technical support',
        markAsDefault: true,
      },
      billing: {
        workflow: billingWorkflow,
        description: 'Billing and payments',
      },
    },
  })

  const input = 'My app crashes when I submit'
  const result = await routing.run(input, {
    timeout: { ms: 5000 },
    retry: { maxAttempts: 3 }
  })
  console.log(result)
}

main().catch(console.error)
