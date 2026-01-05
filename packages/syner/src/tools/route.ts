import { tool, generateObject, gateway } from 'ai'
import { z } from 'zod'

// ============================================================================
// Types
// ============================================================================

/**
 * Metadata for a single route.
 */
export interface RouteMetadata {
  /**
   * Description of what this route handles.
   */
  description: string

  /**
   * When should this route be selected.
   */
  whenToUse: string

  /**
   * Example inputs that should route here.
   */
  examples: string[]
}

/**
 * Configuration for the route tool.
 * Maps route names to their metadata.
 */
export type RouteConfig = Record<string, RouteMetadata>

// ============================================================================
// System Prompt Generator
// ============================================================================

/**
 * Generates a system prompt from route configuration.
 * Uses XML tags for structured prompting.
 *
 * @param config - The route configuration
 * @returns The generated system prompt
 */
function generateSystemPrompt(config: RouteConfig): string {
  const routes = Object.entries(config)
    .map(
      ([key, meta]) => `
<route name="${key}">
  <description>${meta.description}</description>
  <when-to-use>${meta.whenToUse}</when-to-use>
  <examples>
    ${meta.examples.map((e) => `<example>${e}</example>`).join('\n    ')}
  </examples>
</route>`
    )
    .join('\n')

  return `<role>
You are a routing classifier that directs inputs to specialized workflows.
</role>

<instructions>
Analyze the input and select the single most appropriate route based on:
- The primary intent or goal expressed in the input
- Keywords and phrases that signal a specific category
- The type of response or action the input requires
</instructions>

<routes>
${routes}
</routes>

<output>
Return only the route key that best matches the input.
</output>`
}

// ============================================================================
// Route Tool
// ============================================================================

/**
 * Creates a routing tool that classifies input and selects the appropriate route.
 *
 * The system prompt is generated dynamically from the route configuration,
 * eliminating the need for separate .md prompt files.
 *
 * @param config - Route configuration with metadata for each route
 * @returns An AI SDK tool for routing
 *
 * @example
 * ```typescript
 * const myAgent = new ToolLoopAgent({
 *   model: 'anthropic/claude-sonnet-4.5',
 *   tools: {
 *     route({
 *       billing: {
 *         description: 'Billing and payments',
 *         whenToUse: 'Invoices, refunds, subscriptions',
 *         examples: ['I need a refund', 'Update payment method']
 *       },
 *       support: {
 *         description: 'Technical support',
 *         whenToUse: 'Bugs, errors, troubleshooting',
 *         examples: ['App crashes on startup']
 *       }
 *     })
 *   }
 * })
 * ```
 */
export function route(config: RouteConfig) {
  const keys = Object.keys(config) as [string, ...string[]]
  const systemPrompt = generateSystemPrompt(config)
  const modelId = process.env.SYNER_ORCHESTRATOR_MODEL || 'anthropic/claude-haiku-4.5'

  return tool({
    description: 'Classifies input and routes to the appropriate handler based on intent',
    inputSchema: z.object({
      prompt: z.string().describe('The user input to classify'),
    }),
    execute: async ({ prompt }) => {
      const { object: selectedRoute } = await generateObject({
        model: gateway(modelId),
        output: 'enum',
        enum: keys,
        system: systemPrompt,
        prompt: `<input>${prompt}</input>`,
      })

      return { selectedRoute, userPrompt: prompt }
    },
  })
}
