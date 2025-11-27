import type { Agent, Metadata, Workflow } from '@syner/sdk'
import type { LanguageModel } from 'ai'

// ============================================================================
// RoutingConfig
// ============================================================================

export interface RoutingConfig<RouteKey extends string = string> {
  /**
   * The language model to use for classification.
   */
  model: LanguageModel

  /**
   * Map of route keys to workflows.
   */
  routes: Record<RouteKey, Workflow<unknown>>

  /**
   * Optional descriptions for each route to help the LLM classify.
   */
  descriptions?: Record<RouteKey, string>

  /**
   * Optional default route if classification fails.
   */
  defaultRoute?: RouteKey
}

// ============================================================================
// Routing - Agent
// ============================================================================

/**
 * Routing agent - classifies input and delegates to the appropriate workflow.
 *
 * @see https://www.anthropic.com/engineering/building-effective-agents
 */
export class Routing<Output, RouteKey extends string = string>
  implements Agent<Output, RoutingConfig<RouteKey>>
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

  constructor(public config: RoutingConfig<RouteKey>) {}

  /**
   * Executes the routing workflow.
   * Used by the run system for timeout, retry, cancel, etc.
   */
  async execute(input: unknown): Promise<Output> {
    const selected = await this.route(input)
    const workflow = this.config.routes[selected]

    if (!workflow) {
      throw new Error(`Route "${selected}" not found in routes`)
    }

    return workflow.execute(input) as Promise<Output>
  }

  /**
   * Routes the input to the appropriate workflow.
   * This is the semantic method for the routing workflow.
   */
  async route(input: unknown): Promise<RouteKey> {
    const keys = Object.keys(this.config.routes) as RouteKey[]

    try {
      return await this._classify(input, keys)
    } catch (error) {
      if (this.config.defaultRoute) {
        return this.config.defaultRoute
      }
      throw error
    }
  }

  /**
   * Classifies the input into one of the available routes.
   * @internal
   */
  private async _classify(_input: unknown, _keys: RouteKey[]): Promise<RouteKey> {
    // TODO(@claude): Awaiting Ronny's approval - he may have a better
    // alternative to generateObject for classification.
    //
    // Proposed implementation:
    //
    // import { generateObject } from 'ai'
    // import { z } from 'zod'
    //
    // const descriptions = this.config.descriptions
    //   ? keys.map(k => `- ${k}: ${this.config.descriptions?.[k] ?? 'No description'}`).join('\n')
    //   : keys.join(', ')
    //
    // const { object } = await generateObject({
    //   model: this.config.model,
    //   prompt: `Classify this input into one of the available routes.\n\nInput: ${JSON.stringify(input)}\n\nAvailable routes:\n${descriptions}`,
    //   schema: z.object({
    //     route: z.enum(keys as [RouteKey, ...RouteKey[]])
    //   })
    // })
    // return object.route

    throw new Error('Routing._classify() not implemented - awaiting approval')
  }
}
