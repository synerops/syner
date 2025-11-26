import { Agent, type Metadata, type Workflow } from '@syner/sdk'
import type { LanguageModel } from 'ai'

// ============================================================================
// AgenticRouter - Public Interface
// ============================================================================

/**
 * Contract for routing agents that classify input and select a route.
 */
export interface AgenticRouter {
  /**
   * Analyzes input and determines which route to take.
   * @param input - The input to classify
   * @param routes - Available route keys to choose from
   * @returns The selected route key
   */
  route<RouteKey extends string>(input: unknown, routes: RouteKey[]): Promise<RouteKey>
}

// ============================================================================
// Router - Default Implementation
// ============================================================================

export interface RouterConfig {
  /**
   * The language model to use for classification.
   */
  model: LanguageModel

  /**
   * Optional system prompt for the router.
   */
  system?: string

  /**
   * Optional descriptions for each route to help the LLM classify.
   */
  descriptions?: Record<string, string>
}

/**
 * Default router implementation using AI SDK.
 */
export class Router implements AgenticRouter {
  constructor(private _config: RouterConfig) {}

  async route<RouteKey extends string>(
    _input: unknown,
    _routes: RouteKey[]
  ): Promise<RouteKey> {
    // TODO(@claude): Awaiting Ronny's approval - he may have a better
    // alternative to generateObject for classification.
    //
    // Proposed implementation:
    //
    // import { generateObject } from 'ai'
    // import { z } from 'zod'
    //
    // const routeDescriptions = this._config.descriptions
    //   ? _routes.map(r => `- ${r}: ${this._config.descriptions?.[r] ?? 'No description'}`).join('\n')
    //   : _routes.join(', ')
    //
    // const { object } = await generateObject({
    //   model: this._config.model,
    //   system: this._config.system ?? 'You are a router that classifies input into categories.',
    //   prompt: `Classify this input into one of the available routes.\n\nInput: ${JSON.stringify(_input)}\n\nAvailable routes:\n${routeDescriptions}`,
    //   schema: z.object({
    //     route: z.enum(_routes as [RouteKey, ...RouteKey[]])
    //   })
    // })
    // return object.route

    throw new Error('Router.route() not implemented - awaiting approval from Ronny')
  }
}

// ============================================================================
// Routing - Agent
// ============================================================================

export interface RoutingConfig<RouteKey extends string = string> {
  /**
   * The router that classifies input.
   */
  router: AgenticRouter

  /**
   * Map of route keys to workflows.
   */
  routes: Record<RouteKey, Workflow<unknown>>

  /**
   * Optional default route if classification fails.
   */
  defaultRoute?: RouteKey
}

/**
 * Routing agent - classifies input and delegates to the appropriate workflow.
 *
 * @see https://www.anthropic.com/engineering/building-effective-agents
 */
export class Routing<Output, RouteKey extends string = string> extends Agent<
  Output,
  RoutingConfig<RouteKey>
> {
  // TODO(@claude): Awaiting Ronny's approval - using `agentName` instead of `name`
  // to avoid conflict with Function.name. Pending decision on final naming convention.
  static readonly agentName = 'Routing'

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

  constructor(public config: RoutingConfig<RouteKey>) {
    super()
  }

  async execute(input: unknown): Promise<Output> {
    const routeKeys = Object.keys(this.config.routes) as RouteKey[]

    let selectedRoute: RouteKey

    try {
      selectedRoute = await this.config.router.route(input, routeKeys)
    } catch (error) {
      if (this.config.defaultRoute) {
        selectedRoute = this.config.defaultRoute
      } else {
        throw error
      }
    }

    const workflow = this.config.routes[selectedRoute]

    if (!workflow) {
      throw new Error(`Route "${selectedRoute}" not found in routes`)
    }

    return workflow.execute(input) as Promise<Output>
  }
}
