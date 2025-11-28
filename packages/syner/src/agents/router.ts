/**
 * Router Agent
 *
 * A routing agent that classifies input and delegates to specialized workflows.
 * Combines Routing workflow with Agent metadata.
 */

import { Routing, type RoutingConfig } from '../workflows/routing'
import type { Agent, Metadata } from '@syner/sdk'

/**
 * Router Agent - extends Routing workflow with agent metadata
 *
 * @typeParam OUTPUT - The output type from the delegated workflows
 */
export class Router<OUTPUT> extends Routing<OUTPUT> implements Agent {
  public metadata: Metadata

  constructor(config: RoutingConfig<OUTPUT>) {
    super(config)

    this.metadata = {
      annotations: {
        whenToUse: `Routing works well for complex tasks where there are distinct categories that are better handled separately, and where classification can be handled accurately, either by an LLM or a more traditional classification model/algorithm.`,
        examples: [
          `Directing different types of customer service queries (general questions, refund requests, technical support) into different downstream processes, prompts, and tools.`,
          `Routing easy/common questions to smaller, cost-efficient models like Claude Haiku 4.5 and hard/unusual questions to more capable models like Claude Sonnet 4.5 to optimize for best performance.`,
        ],
      }
    }
  }
}
