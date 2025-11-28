/**
 * Agent Protocol
 *
 * Defines the base contract for all agents in Syner OS.
 */

import type { Workflow } from '../runs'

// ============================================================================
// Annotations
// ============================================================================

/**
 * Semantic annotations that describe when and how to use an agent.
 * These help Syner understand the purpose and applicability of each agent.
 */
export interface Annotations {
  /**
   * Describes the conditions under which this agent should be used.
   */
  whenToUse: string

  /**
   * Concrete examples of use cases for this agent.
   */
  examples: string[]

  /**
   * Extensible for additional annotations.
   */
  [key: string]: unknown
}

// ============================================================================
// Metadata
// ============================================================================

/**
 * Metadata associated with an agent.
 * Contains annotations and optional fields for documentation, licensing, etc.
 */
export interface Metadata {
  /**
   * Semantic annotations for the agent.
   */
  annotations: Annotations

  /**
   * License identifier (e.g., "MIT", "Apache-2.0").
   */
  license?: string

  /**
   * URL to the agent's documentation.
   */
  documentationUrl?: string

  /**
   * Extensible for additional metadata fields.
   */
  [key: string]: unknown
}

// ============================================================================
// Agent
// ============================================================================

/**
 * An Agent is a Workflow with metadata.
 *
 * - Workflow: run() for the run system (timeout, retry, cancel, etc.)
 * - Agent: adds static metadata (name, description, annotations) for Syner
 *
 * @typeParam OUTPUT - The type returned by run()
 * @typeParam CONFIG - The configuration type for this agent
 *
 * @example
 * ```typescript
 * class MyAgent implements Agent<string, MyConfig> {
 *   static readonly name = 'MyAgent'
 *   static readonly description = 'Does something useful'
 *   static readonly metadata: Metadata = {
 *     annotations: { whenToUse: '...', examples: ['...'] }
 *   }
 *
 *   constructor(public config: MyConfig) {}
 *
 *   async run(input: string, runtimeConfig?: RuntimeConfig): Promise<string> {
 *     // implementation
 *   }
 * }
 * ```
 */
export interface Agent<OUTPUT, CONFIG = Record<string, unknown>>
  extends Workflow<OUTPUT> {
  /**
   * Instance configuration provided by the user.
   * This is the agent's configuration (model, settings, etc.),
   * not the runtime config (timeout, retry, cancel).
   */
  config: CONFIG
}
