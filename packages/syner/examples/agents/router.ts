/**
 * Router Agent Example
 *
 * Shows a complete agent using routing internally.
 * Run: bun run examples/agents/router.ts
 */

import { Routing } from '../../src'
import type { Agent, Workflow } from '@syner/sdk'

// Specialized workflows
const supportWorkflow: Workflow<string, string> = {
  run: async (input: string) => `[Support Team] Creating ticket for: ${input}`,
}

const billingWorkflow: Workflow<string, string> = {
  run: async (input: string) => `[Billing Team] Processing request: ${input}`,
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

  async run(input: string): Promise<string> {
    return this.routing.run(input)
  }
}

async function main() {
  const agent = new Router()
  const result = await agent.generate('Need refund for last payment')
  console.log(result)
}

main().catch(console.error)
