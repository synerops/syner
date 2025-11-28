/**
 * Router Agent Example
 *
 * Shows how to use the Router agent with specialized workflows.
 * Run: bun run examples/agents/router.ts
 */

import { Router } from '../../src/agents/router'
import type { Workflow } from '@syner/sdk'

// Specialized workflows for this example
const supportWorkflow: Workflow<string> = {
  run: async (prompt: string) => `[Support Team] Creating ticket for: ${prompt}`,
}

const billingWorkflow: Workflow<string> = {
  run: async (prompt: string) => `[Billing Team] Processing request: ${prompt}`,
}

async function main() {
  const agent = new Router({
    model: 'anthropic/claude-haiku-4.5',
    workflows: {
      support: {
        workflow: supportWorkflow,
        description: 'Technical issues',
        markAsDefault: true,
      },
      billing: {
        workflow: billingWorkflow,
        description: 'Payment issues',
      },
    },
  })

  const classification = await agent.run('Need refund for last payment')
  console.log({ classification })
}

main().catch(console.error)
