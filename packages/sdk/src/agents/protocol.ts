/**
 * Agent Protocol
 *
 * Defines the base contract for all agents in Syner OS.
 */

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
 * Base interface for all agents in Syner OS.
 *
 * @typeParam Output - The type returned by execute()
 * @typeParam Config - The configuration type for this agent
 *
 * @example
 * ```typescript
 * interface MyConfig {
 *   model: LanguageModel
 * }
 *
 * class MyAgent implements Agent<string, MyConfig> {
 *   static readonly name = 'MyAgent'
 *   static readonly description = 'Does something useful'
 *   static readonly metadata: Metadata = {
 *     annotations: { whenToUse: '...', examples: ['...'] }
 *   }
 *
 *   constructor(public config: MyConfig) {}
 *
 *   async execute(input: unknown): Promise<string> {
 *     // implementation
 *   }
 * }
 * ```
 */
export interface Agent<Output, Config = Record<string, unknown>> {
  /**
   * Instance configuration provided by the user.
   */
  config: Config

  /**
   * Executes the agent's logic.
   *
   * @param input - The input to process
   * @returns A promise resolving to the output
   */
  execute(input: unknown): Promise<Output>
}
