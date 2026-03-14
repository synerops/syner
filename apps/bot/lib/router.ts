/**
 * Message Router
 *
 * Classifies incoming messages and dispatches to the right execution path.
 * Gap 1 solution from #355: syner agent receives all messages and delegates.
 */

import { createSession, type SessionOptions } from './session'
import type { AgentCard } from '@syner/sdk/agents'
import type { Result } from '@syner/osprotocol'
import type { GenerateResult } from './session'

export type Intent = 'direct' | 'chain' | 'delegate'

export interface RouteContext {
  /** The Slack channel (or other source) */
  channel: string
  /** The agent matched for this channel */
  agent: AgentCard
  /** Optional thread ID for context */
  threadId?: string
}

export interface RouteResult {
  intent: Intent
  agent?: string
  chain?: unknown[]
}

/**
 * Classify a message into an intent and route accordingly.
 *
 * - `direct`: simple Q&A, use existing session flow
 * - `chain`: multi-step orchestration via executeChain()
 * - `delegate`: route to a specialist agent via POST /agent
 */
export function classifyIntent(message: string): Intent {
  // Chain patterns: explicit multi-step requests
  const chainPatterns = [
    /\b(then|after that|next step|followed by)\b/i,
    /\b(chain|pipeline|workflow|sequence)\b/i,
  ]

  // Delegate patterns: explicit agent targeting
  const delegatePatterns = [
    /^@(\w+)\s/,
    /\b(ask|delegate to|hand off to|route to)\s+(\w+)/i,
  ]

  for (const pattern of delegatePatterns) {
    if (pattern.test(message)) return 'delegate'
  }

  for (const pattern of chainPatterns) {
    if (pattern.test(message)) return 'chain'
  }

  return 'direct'
}

/**
 * Route a message through the appropriate execution path.
 *
 * Returns the result text for the caller to deliver.
 */
export async function classifyAndRoute(
  message: string,
  context: RouteContext,
  sessionOptions?: Partial<SessionOptions>
): Promise<string> {
  const intent = classifyIntent(message)

  switch (intent) {
    case 'direct':
      return handleDirect(message, context, sessionOptions)

    case 'delegate': {
      const targetAgent = extractDelegateTarget(message)
      if (targetAgent) {
        return handleDelegate(message, targetAgent)
      }
      // Fallback to direct if we can't extract a target
      return handleDirect(message, context, sessionOptions)
    }

    case 'chain':
      console.warn('[Router] chain intent not yet implemented, falling back to direct')
      return handleDirect(message, context, sessionOptions)
  }
}

/**
 * Direct: simple Q&A through the session.
 *
 * Session uses two-phase execution: first tries without tools (fast),
 * escalates to sandbox only if the LLM requests tool calls.
 */
async function handleDirect(
  message: string,
  context: RouteContext,
  sessionOptions?: Partial<SessionOptions>
): Promise<string> {
  const session = await createSession({
    agent: context.agent,
    ...sessionOptions,
  })

  try {
    const result = await session.generate(message)
    return result.output?.text || '_No response_'
  } finally {
    await session.cleanup()
  }
}

/**
 * Delegate: invoke a specialist agent via its POST /agent endpoint.
 */
async function handleDelegate(message: string, targetAgent: string): Promise<string> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3001'

  const res = await fetch(`${baseUrl}/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '',
    },
    body: JSON.stringify({ agentName: targetAgent, task: message }),
  })

  if (!res.ok) {
    return `_Failed to reach agent "${targetAgent}" (${res.status})_`
  }

  const result: Result<GenerateResult> = await res.json()
  return result.output?.text || '_No response from delegate_'
}

/**
 * Extract the target agent name from a delegate message.
 */
function extractDelegateTarget(message: string): string | null {
  const atMatch = message.match(/^@(\w+)\s/)
  if (atMatch) return atMatch[1]

  const delegateMatch = message.match(/\b(?:ask|delegate to|hand off to|route to)\s+(\w+)/i)
  if (delegateMatch) return delegateMatch[1]

  return null
}
