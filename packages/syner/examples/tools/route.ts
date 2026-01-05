/**
 * Route Tool Example
 *
 * Shows how to use route() tool to classify input.
 * Run: bun run examples/tools/route.ts
 */

import { generateText } from 'ai'
import { route } from '../../src'

async function main() {
  const input = 'My app crashes when I submit'

  const result = await generateText({
    model: 'anthropic/claude-haiku-4.5',
    prompt: input,
    tools: {
      route: route({
        support: {
          description: 'Technical support',
          whenToUse: 'Bugs, errors, crashes',
          examples: ['App crashes', "Can't login"],
        },
        billing: {
          description: 'Billing and payments',
          whenToUse: 'Invoices, refunds',
          examples: ['Need refund', 'Update card'],
        },
      }),
    },
    maxSteps: 2,
  })

  const toolResult = result.toolResults?.[0] as { output: { route: string } }
  console.log(`Input: ${input}`)
  console.log(`Route: ${toolResult.output.route}`)
}

main().catch(console.error)
