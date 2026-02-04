/**
 * Routing Workflow Implementation
 *
 * Classifies input and delegates to specialized workflows based on classification.
 *
 * @see https://www.anthropic.com/engineering/building-effective-agents
 */

import type { Workflow, Run, Timeout, Retry, Cancel } from '../runs'

/**
 * Configuration for a single route
 */
export interface RouteConfig {
  /** Human-readable description of this route */
  description: string
  /** Conditions under which this route should be selected */
  whenToUse?: string[]
  /** Example inputs that match this route */
  examples?: string[]
}

/**
 * Entry in the workflows map
 */
export interface RoutingWorkflowEntry<Output> {
  /** The workflow to delegate to */
  workflow: Workflow<Output>
  /** Route metadata */
  route: RouteConfig
  /** Mark as default when classification fails */
  markAsDefault?: boolean
}

/**
 * Configuration for creating a routing workflow
 */
export interface RoutingConfig<Output> {
  /** Classifier function (injected by implementation) */
  classifier: (prompt: string, routes: string[]) => Promise<string>
  /** Map of route keys to their workflow entries */
  workflows: Record<string, RoutingWorkflowEntry<Output>>
}

/**
 * Routing workflow that classifies input and delegates to specialized workflows
 *
 * This is a base implementation. Use with an AI SDK classifier:
 *
 * @example
 * ```typescript
 * const routing = new Routing({
 *   classifier: async (prompt, routes) => {
 *     const { object } = await generateObject({
 *       model: gateway('anthropic/claude-haiku'),
 *       output: 'enum',
 *       enum: routes,
 *       prompt,
 *     })
 *     return object
 *   },
 *   workflows: {
 *     billing: { workflow: billingWorkflow, route: { description: '...' } },
 *     support: { workflow: supportWorkflow, route: { description: '...' } },
 *   }
 * })
 * ```
 */
export class Routing<Output> implements Workflow<Output> {
  timeout?: Timeout
  retry?: Retry
  cancel?: Cancel
  onComplete?: (result: Output) => void
  onFailed?: (error: Error) => void

  constructor(public config: RoutingConfig<Output>) {
    // Validate only one workflow has markAsDefault
    const entries = Object.entries(config.workflows)
    const defaults = entries.filter(([_, entry]) => entry.markAsDefault)
    if (defaults.length > 1) {
      throw new Error('Only one workflow can be marked as default')
    }
  }

  /**
   * Run the routing workflow
   *
   * @param prompt - The input prompt to classify and route
   * @param options - Optional run configuration
   * @returns The output from the selected workflow
   */
  async run(prompt: string, options?: Run<Output>): Promise<Output> {
    const selected = await this.classify(prompt)
    const entry = this.config.workflows[selected]

    if (!entry?.workflow) {
      throw new Error(`Workflow "${selected}" not found`)
    }

    return entry.workflow.run(prompt, options)
  }

  /**
   * Classify the prompt and return the selected workflow key
   *
   * @param prompt - The input prompt to classify
   * @returns The selected workflow key
   */
  async classify(prompt: string): Promise<string> {
    const entries = Object.entries(this.config.workflows)
    const keys = entries.map(([key]) => key)

    try {
      return await this.config.classifier(prompt, keys)
    } catch (error) {
      console.error('Routing classification error:', error)

      // Find default workflow
      const defaultEntry = entries.find(([_, entry]) => entry.markAsDefault)
      if (defaultEntry) {
        return defaultEntry[0]
      }

      throw error
    }
  }
}

/**
 * Infer the output type from a Routing instance
 */
export type InferRoutingOutput<T> = T extends Routing<infer U> ? U : never
