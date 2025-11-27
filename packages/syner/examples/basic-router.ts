/**
 * Basic Router Agent Example
 *
 * Demonstrates how to use the route() tool to classify user input
 * and route to different handlers based on intent.
 *
 * @example
 * ```bash
 * # Set your AI Gateway API key
 * export AI_GATEWAY_API_KEY=your-key
 *
 * # Run the example
 * bun run examples/basic-router.ts
 * ```
 */

import { generateText, gateway } from 'ai'
import { route } from '../src'

// Create the router tool with route definitions
const routerTool = route({
  support: {
    description: 'Technical support and troubleshooting',
    whenToUse: 'User has bugs, errors, crashes, or technical issues',
    examples: [
      'My app is crashing',
      "I can't login to my account",
      'Getting an error message',
    ],
  },
  billing: {
    description: 'Billing, payments, and subscriptions',
    whenToUse: 'User asks about invoices, refunds, payment methods, or subscription plans',
    examples: [
      'I need a refund',
      'Update my payment method',
      'Cancel my subscription',
    ],
  },
  code: {
    description: 'Code assistance and development',
    whenToUse: 'User wants help writing, reviewing, or debugging code',
    examples: [
      'Write a function to sort an array',
      'Review my code',
      'How do I use async/await?',
    ],
  },
  general: {
    description: 'General questions and conversation',
    whenToUse: 'Greetings, general questions, or anything that does not fit other categories',
    examples: [
      'Hello, how are you?',
      'What can you help me with?',
      'Tell me a joke',
    ],
  },
})

// Test inputs to classify
const testInputs = [
  'My app is crashing when I click the submit button',
  'I need a refund for my subscription',
  'Write a function to sort an array in TypeScript',
  'Hello, how are you today?',
]

async function main() {
  const model = gateway(process.env.SYNER_ORCHESTRATOR_MODEL || 'anthropic/claude-haiku-4.5')

  console.log('Basic Router Agent Example')
  console.log('==========================\n')

  for (const input of testInputs) {
    console.log(`Input: "${input}"`)

    const result = await generateText({
      model,
      prompt: `Classify this user input and route it to the appropriate handler: "${input}"`,
      tools: {
        route: routerTool,
      },
      maxSteps: 2,
      toolChoice: 'required',
    })

    if (result.toolResults && result.toolResults.length > 0) {
      const toolResult = result.toolResults[0] as { output: { route: string } }
      console.log(`Route: ${toolResult.output.route}`)
    }
    console.log('')
  }
}

main().catch(console.error)
