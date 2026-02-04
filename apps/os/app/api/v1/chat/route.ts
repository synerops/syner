/**
 * Chat API v1
 *
 * Main chat endpoint using SDK skill discovery and AI SDK v6.
 */

import { generateText, stepCountIs } from 'ai'
import { NextResponse } from 'next/server'
import { createSandbox, writeFiles, readFile } from '@syner/vercel'
import { env } from '@syner/sdk'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { prompt?: string }
    const model = process.env.SYNER_ORCHESTRATOR_MODEL || 'anthropic/claude-haiku-4.5'
    const prompt =
      body.prompt ||
      "Create a sandbox environment with Node.js 22, then write a file called test.js with the content \"console.log('Hello from sandbox!')\" and read it back"

    const result = await generateText({
      model,
      prompt,
      stopWhen: stepCountIs(20),
      tools: {
        createSandbox: createSandbox({
          runtime: 'node22',
          timeout: 300000,
        }),
        writeFiles: writeFiles(),
        readFile: readFile(),
      },
    })

    console.log('Text:', result.text)
    console.log('Tool Calls:', JSON.stringify(result.toolCalls, null, 2))
    console.log('Tool Results:', JSON.stringify(result.toolResults, null, 2))
    console.log('Sandbox in env:', env.getSandbox())

    return NextResponse.json({
      text: result.text,
      toolCalls: result.toolCalls,
      toolResults: result.toolResults,
      sandbox: env.getSandbox(),
    })
  } catch (error) {
    console.error('Error in POST /api/v1/chat:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
