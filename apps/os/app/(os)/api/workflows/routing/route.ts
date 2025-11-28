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
    async run(input: string) {
      return {
        route: name,
        message: `Routed to "${name}" workflow with input: ${input}`,
      }
    },
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as { prompt?: string }
    const { prompt } = body

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
      workflows: {
        support: {
          workflow: createMockWorkflow('support'),
          description: 'Technical support, bugs, errors, and troubleshooting',
          markAsDefault: false,
        },
        billing: {
          workflow: createMockWorkflow('billing'),
          description: 'Payments, invoices, refunds, and subscription issues',
        },
        code: {
          workflow: createMockWorkflow('code'),
          description: 'Writing, reviewing, or debugging code',
        },
        general: {
          workflow: createMockWorkflow('general'),
          description: 'General questions, greetings, and casual conversation',
          markAsDefault: true,
        },
      },
    })

    // Test the classify() method to see classification
    const selectedRoute = await router.classify(prompt)

    // Test the full run() to see delegation
    const result = await router.run(prompt)

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
