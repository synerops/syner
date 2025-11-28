import type { Workflow, RuntimeConfig } from '@syner/sdk'
import type { LanguageModel } from 'ai'
import { generateObject } from 'ai'

// Inline system prompt
const classifierSystemPrompt = `<role>
You are a routing classifier that directs inputs to specialized workflows.
</role>

<instructions>
Analyze the input and select the single most appropriate route based on:
- The primary intent or goal expressed in the input
- Keywords and phrases that signal a specific category
- The type of response or action the input requires
</instructions>

<output>
Return only the route key that best matches the input.
</output>`

// ============================================================================
// RoutingConfig
// ============================================================================

export interface RoutingConfig<ROUTE extends string = string> {
  /**
   * The language model to use for classification.
   */
  model: LanguageModel

  /**
   * Map of workflow keys to workflow metadata.
   */
  workflows: Record<ROUTE, {
    workflow: Workflow<any, any>
    description: string
    markAsDefault?: boolean
  }>
}

// ============================================================================
// Routing - Workflow
// ============================================================================

/**
 * Routing workflow - classifies input and delegates to the appropriate workflow.
 *
 * Uses composition with generateObject for classification, keeping the
 * AI SDK as an internal implementation detail.
 *
 * @typeParam OUTPUT - The output type from the delegated workflow
 * @typeParam ROUTE - The string literal union of workflow keys
 *
 * @see https://www.anthropic.com/engineering/building-effective-agents
 */
export class Routing<OUTPUT, ROUTE extends string = string>
  implements Workflow<OUTPUT, RuntimeConfig>
{
  constructor(public config: RoutingConfig<ROUTE>) {
    // Validate only one workflow has markAsDefault
    const entries = Object.entries(config.workflows) as [ROUTE, {
      workflow: Workflow<any, any>
      description: string
      markAsDefault?: boolean
    }][]
    const defaults = entries.filter(([_, meta]) => meta.markAsDefault)
    if (defaults.length > 1) {
      throw new Error('Only one workflow can be marked as default')
    }
  }

  /**
   * Runs the routing workflow.
   * Classifies input and executes the selected workflow.
   *
   * @param input - The input string to classify and route
   * @param runtimeConfig - Optional runtime configuration (timeout, retry, cancel)
   * @returns The output from the selected workflow
   */
  async run(input: string, runtimeConfig?: RuntimeConfig): Promise<OUTPUT> {
    const selected = await this.classify(input)
    const { workflow } = this.config.workflows[selected]

    if (!workflow) {
      throw new Error(`Workflow "${selected}" not found`)
    }

    return workflow.run(input, runtimeConfig) as Promise<OUTPUT>
  }

  /**
   * Classifies the input and returns the selected workflow key.
   *
   * @param input - The input string to classify
   * @returns The selected workflow key
   */
  async classify(input: string): Promise<ROUTE> {
    const entries = Object.entries(this.config.workflows) as [ROUTE, {
      workflow: Workflow<any, any>
      description: string
      markAsDefault?: boolean
    }][]
    const keys = entries.map(([key]) => key)
    const descriptions = entries
      .map(([key, { description }]) => `- ${key}: ${description}`)
      .join('\n')

    try {
      const { object } = await generateObject({
        model: this.config.model,
        output: 'enum',
        enum: keys,
        system: classifierSystemPrompt,
        prompt: `<input>${input}</input>\n\n<routes>\n${descriptions}\n</routes>`,
      })

      return object as ROUTE
    } catch (error) {
      console.error('Routing classification error:', error)
      
      // Find default workflow
      const defaultEntry = entries.find(([_, meta]) => meta.markAsDefault)
      if (defaultEntry) {
        return defaultEntry[0] as ROUTE
      }
      
      throw error
    }
  }
}

// ============================================================================
// Type Inference
// ============================================================================

/**
 * Infer the output type from a Routing instance.
 *
 * @example
 * ```typescript
 * const routing = new Routing({ ... })
 * type Output = InferRoutingOutput<typeof routing>
 * ```
 */
export type InferRoutingOutput<T> = 
  T extends Routing<infer OUTPUT, any> ? OUTPUT : never
