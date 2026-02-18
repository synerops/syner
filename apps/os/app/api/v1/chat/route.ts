/**
 * Chat API v1
 *
 * Main chat endpoint with complete agent loop implementation.
 * Syner has identity, tools, and context → actions → checks pattern.
 */

import { generateText, stepCountIs } from 'ai'
import { NextResponse } from 'next/server'
import { env } from '@syner/sdk'
import { loadSynerIdentity, buildSystemPrompt } from '../../../../lib/identity'
import { getTools, getToolDescriptions } from '../../../../lib/tools'
import {
  createLoopState,
  createStepFinishHandler,
  getLoopSummary,
} from '../../../../lib/agent-loop'

interface ChatRequest {
  prompt?: string
  maxSteps?: number
  verbose?: boolean
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest
    const model = process.env.SYNER_ORCHESTRATOR_MODEL || 'anthropic/claude-haiku-4.5'
    const maxSteps = body.maxSteps ?? 20
    const verbose = body.verbose ?? true

    const prompt =
      body.prompt ||
      "Hello! Who are you and what can you help me with?"

    // 1. Load Syner's identity
    const identity = await loadSynerIdentity()

    if (verbose) {
      console.log('[chat] Loaded identity:', identity.agent.metadata.name)
    }

    // 2. Get tools
    const tools = getTools()
    const descriptions = getToolDescriptions()

    if (verbose) {
      console.log('[chat] Available tools:', Object.keys(tools))
    }

    // 3. Build system prompt with identity and tools
    const system = buildSystemPrompt(identity, descriptions)

    if (verbose) {
      console.log('[chat] System prompt length:', system.length)
    }

    // 4. Initialize loop state
    const loopState = createLoopState()
    const onStepFinish = createStepFinishHandler(loopState, { verbose })

    // 5. Execute agent loop
    const result = await generateText({
      model,
      system,
      prompt,
      tools,
      stopWhen: stepCountIs(maxSteps),
      onStepFinish,
    })

    // 6. Get loop summary
    const summary = getLoopSummary(loopState)

    if (verbose) {
      console.log('[chat] Loop summary:', summary)
    }

    // 7. Return response
    return NextResponse.json({
      text: result.text,
      steps: {
        total: summary.totalSteps,
        toolCalls: summary.totalToolCalls,
        tools: summary.uniqueTools,
        duration: summary.duration,
        errors: summary.errors,
      },
      sandbox: env.getSandbox(),
      identity: {
        name: identity.agent.metadata.name,
        version: identity.agent.metadata.version,
      },
    })
  } catch (error) {
    console.error('Error in POST /api/v1/chat:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
