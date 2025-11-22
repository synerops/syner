import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { createSandbox } from '@syner/vercel';
import { env } from '@syner/sdk';

export async function POST(req: Request) {
  try {
    const result = await generateText({
      model: 'openai/gpt-5.1',
      system: 'You are syner, a helpful assistant with sandbox capabilities',
      prompt: 'Create a sandbox environment with Node.js 22',
      maxSteps: 5,
      tools: {
        createSandbox: createSandbox({
          runtime: 'node22',
          timeout: 300000,
        }),
      }
    });

    console.log('Text:', result.text);
    console.log('Tool Calls:', JSON.stringify(result.toolCalls, null, 2));
    console.log('Tool Results:', JSON.stringify(result.toolResults, null, 2));
    console.log('Sandbox in env:', env.getSandbox());

    return NextResponse.json({
      text: result.text,
      toolCalls: result.toolCalls,
      toolResults: result.toolResults,
      sandbox: env.getSandbox()
    });
  } catch (error) {
    console.error('Error in POST /api/chat:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
