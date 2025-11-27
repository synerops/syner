// TODO(claude): Ready for Ronny's review and approval.
// Routing workflow test endpoint - all 4 routes classify correctly:
// - "My app is crashing" -> support
// - "I need a refund for my subscription" -> billing
// - "Write a function to sort an array" -> code
// - "Hello, how are you?" -> general

import { NextResponse } from 'next/server'
import { Routing } from 'syner'
import type { Workflow } from '@syner/sdk'
import type { LanguageModel } from 'ai'

/**
 * Simple mock workflow for testing.
 * Returns a message indicating which route was selected.
 */
function createMockWorkflow(name: string): Workflow<{ route: string; message: string }> {
  return {
    async execute(input: unknown) {
      return {
        route: name,
        message: `Routed to "${name}" workflow with input: ${JSON.stringify(input)}`,
      }
    },
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing "prompt" in request body' },
        { status: 400 }
      )
    }

    // Use Haiku for fast/cheap testing
    const model = process.env.SYNER_ORCHESTRATOR_MODEL || 'anthropic/claude-haiku-4.5'

    const router = new Routing<{ route: string; message: string }>({
      model: model as unknown as LanguageModel,
      routes: {
        support: createMockWorkflow('support'),
        billing: createMockWorkflow('billing'),
        code: createMockWorkflow('code'),
        general: createMockWorkflow('general'),
      },
      descriptions: {
        support: 'Technical support, bugs, errors, and troubleshooting',
        billing: 'Payments, invoices, refunds, and subscription issues',
        code: 'Writing, reviewing, or debugging code',
        general: 'General questions, greetings, and casual conversation',
      },
      defaultRoute: 'general',
    })

    // Test the route() method to see classification
    const selectedRoute = await router.route(prompt)

    // Test the full execute() to see delegation
    const result = await router.execute(prompt)

    return NextResponse.json({
      input: prompt,
      selectedRoute,
      result,
    })
  } catch (error) {
    console.error('Error in POST /api/test-routing:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
