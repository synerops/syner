import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { run, type RunOptions } from '@syner/sdk';
import { createVercelSandbox, type VercelSandboxOptions } from '@syner/vercel';

/**
 * Handle POST requests to the syner agent endpoint.
 * 
 * Supports two modes:
 * - respond: Simple conversation without sandbox
 * - run: Execute task in sandbox (when inSandbox is true)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, task, inSandbox, project, sandboxOptions } = body;

    // Determine mode based on inSandbox flag
    if (inSandbox) {
      // Run mode: Execute in sandbox
      return await handleRun({
        task,
        project,
        sandboxOptions,
      });
    } else {
      // Respond mode: Simple conversation without sandbox
      return await handleRespond({
        messages,
      });
    }
  } catch (error) {
    console.error('Error in syner agent endpoint:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle simple conversation (respond mode).
 * This mode doesn't use sandbox.
 */
async function handleRespond(options: { messages: unknown[] }) {
  // TODO: Implement simple conversation mode without sandbox
  // This will use orchestrator or direct agent execution
  // For now, return a placeholder response
  return NextResponse.json({
    message: 'Respond mode not yet implemented',
    options,
  });
}

/**
 * Handle task execution in sandbox (run mode).
 * This mode creates a sandbox and executes the task within it.
 */
async function handleRun(options: {
  task: string;
  project?: { url: string };
  sandboxOptions?: VercelSandboxOptions;
}) {
  const { task, project, sandboxOptions } = options;

  // Create Vercel Sandbox
  const sandbox = await createVercelSandbox({
    ...sandboxOptions,
    runtime: sandboxOptions?.runtime || 'node22',
  });

  try {
    // Execute run with sandbox
    const runResult = await run({
      task,
      inSandbox: true,
      project,
      sandbox,
      sandboxOptions,
    });

    // Stream the result
    const stream = streamText({
      model: {
        provider: 'openai',
        id: 'gpt-4', // TODO: Get from config
      },
      prompt: runResult.result.text || task,
    });

    return stream.toDataStreamResponse();
  } catch (error) {
    // Ensure sandbox cleanup on error
    try {
      await sandbox.destroy();
    } catch (cleanupError) {
      console.error('Failed to cleanup sandbox:', cleanupError);
    }
    throw error;
  }
}

