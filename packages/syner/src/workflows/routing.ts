import type { Agent, Metadata, Workflow } from '@syner/sdk'
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

export interface RoutingConfig<WorkflowKey extends string = string> {
  /**
   * The language model to use for classification.
   */
  model: LanguageModel

  /**
   * Map of workflow keys to workflow metadata.
   */
  workflows: Record<WorkflowKey, {
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
 * @typeParam Output - The output type from the delegated workflow
 * @typeParam WorkflowKey - The string literal union of workflow keys
 *
 * @see https://www.anthropic.com/engineering/building-effective-agents
 */
export class Routing<Output, WorkflowKey extends string = string>
  implements Agent<Output, RoutingConfig<WorkflowKey>>
{
  static readonly name = 'Routing'

  static readonly description =
    'Classifies an input and directs it to a specialized followup task. ' +
    'Allows separation of concerns and building more specialized prompts. ' +
    'Without this workflow, optimizing for one kind of input can hurt performance on other inputs.'

  static readonly metadata: Metadata = {
    annotations: {
      whenToUse:
        'Routing works well for complex tasks where there are distinct categories ' +
        'that are better handled separately, and where classification can be handled ' +
        'accurately, either by an LLM or a more traditional classification model/algorithm.',
      examples: [
        'Directing different types of customer service queries (general questions, refund requests, technical support) into different downstream processes, prompts, and tools.',
        'Routing easy/common questions to smaller, cost-efficient models like Claude Haiku 4.5 and hard/unusual questions to more capable models like Claude Sonnet 4.5 to optimize for best performance.',
      ],
    },
  }

  constructor(public config: RoutingConfig<WorkflowKey>) {
    // Validate only one workflow has markAsDefault
    const entries = Object.entries(config.workflows) as [WorkflowKey, {
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
   * @returns The output from the selected workflow
   */
  async run(input: string): Promise<Output> {
    const selected = await this.classify(input)
    const { workflow } = this.config.workflows[selected]

    if (!workflow) {
      throw new Error(`Workflow "${selected}" not found`)
    }

    return workflow.run(input) as Promise<Output>
  }

  /**
   * Classifies the input and returns the selected workflow key.
   *
   * @param input - The input string to classify
   * @returns The selected workflow key
   */
  async classify(input: string): Promise<WorkflowKey> {
    const entries = Object.entries(this.config.workflows) as [WorkflowKey, {
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

      return object as WorkflowKey
    } catch (error) {
      console.error('Routing classification error:', error)
      
      // Find default workflow
      const defaultEntry = entries.find(([_, meta]) => meta.markAsDefault)
      if (defaultEntry) {
        return defaultEntry[0] as WorkflowKey
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
  T extends Routing<infer Output, any> ? Output : never
