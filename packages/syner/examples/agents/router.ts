/**
 * Router Agent Example
 *
 * Shows a complete agent using routing internally.
 * Run: bun run examples/agents/router.ts
 */

import { Routing } from '../../src'
import type { Agent, Workflow } from '@syner/sdk'

// Specialized workflows
const supportWorkflow: Workflow<string> = {
  run: async (prompt: string) => `[Support Team] Creating ticket for: ${prompt}`,
}

const billingWorkflow: Workflow<string> = {
  run: async (prompt: string) => `[Billing Team] Processing request: ${prompt}`,
}

// Router Agent
class Router implements Agent<string> {
  private routing: Routing<string>

  constructor() {
    this.routing = new Routing({
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
  }

  async run(prompt: string): Promise<string> {
    return this.routing.run(prompt)
  }
}

async function main() {
  const agent = new Router()
  const result = await agent.run('Need refund for last payment')
  console.log(result)
}

main().catch(console.error)
