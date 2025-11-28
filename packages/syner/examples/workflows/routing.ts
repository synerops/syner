/**
 * Routing Workflow Example
 *
 * Shows how to use Routing workflow to classify and execute specialized workflows.
 * Run: bun run examples/workflows/routing.ts
 */

import { Routing } from '../../src'
import type { Workflow } from '@syner/sdk'

// Define specialized workflows
const supportWorkflow: Workflow<string, string> = {
  run: async (input: string) => {
    return `[Support] Handling: ${input}`
  },
}

const billingWorkflow: Workflow<string, string> = {
  run: async (input: string) => {
    return `[Billing] Processing: ${input}`
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
  const result = await routing.run(input)
  console.log(result)
}

main().catch(console.error)
