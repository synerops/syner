#!/usr/bin/env bun
/**
 * dispatch.ts - Workflow dispatcher based on intent classification
 *
 * Receives an IntentClassification (from detect.ts) and dispatches
 * to the appropriate workflow or action.
 *
 * Usage:
 *   bun run detect "refactor auth module" | bun run dispatch
 *   echo '{"intent":...}' | bun run dispatch
 */

import { IntentClassificationSchema, type IntentClassification } from '../intent'

interface DispatchResult {
  action: string
  workflow?: string
  message?: string
  error?: string
}

function dispatch(classification: IntentClassification): DispatchResult {
  const { intent, strategy, next_action } = classification

  switch (next_action.action) {
    case 'respond':
      return {
        action: 'respond',
        message: next_action.details || 'Direct response - no workflow needed',
      }

    case 'execute':
      return {
        action: 'execute',
        message: next_action.details || 'Execute task directly',
      }

    case 'plan':
      return {
        action: 'plan',
        message: 'Entering plan mode',
      }

    case 'delegate':
      if (!strategy.suggested_workflow) {
        return {
          action: 'delegate',
          workflow: 'route', // Default to routing
          message: `Delegating: ${next_action.details}`,
        }
      }

      return {
        action: 'delegate',
        workflow: strategy.suggested_workflow,
        message: `Delegating to ${strategy.suggested_workflow}: ${next_action.details}`,
      }

    case 'ask':
      return {
        action: 'ask',
        message: next_action.details || 'Need clarification from user',
      }

    default:
      return {
        action: 'error',
        error: `Unknown action: ${next_action.action}`,
      }
  }
}

async function main() {
  // Read classification from stdin
  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }
  const input = Buffer.concat(chunks).toString().trim()

  if (!input) {
    console.error('Usage: bun run detect "prompt" | bun run dispatch')
    process.exit(1)
  }

  let classification: IntentClassification
  try {
    const parsed = JSON.parse(input)
    classification = IntentClassificationSchema.parse(parsed)
  } catch (error) {
    console.error('Invalid IntentClassification:', error)
    process.exit(1)
  }

  const result = dispatch(classification)
  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => {
  console.error('Error:', error.message)
  process.exit(1)
})
