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
 * Metadata associated with an agent class.
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
// Agent Static Interface
// ============================================================================

/**
 * Static interface that agent classes must implement.
 * This defines the class-level properties (name, description, metadata).
 */
export interface AgentStatic<Output, Config = Record<string, unknown>> {
  readonly name: string
  readonly description: string
  readonly metadata: Metadata
  new (config: Config): AgentInstance<Output, Config>
}

// ============================================================================
// Agent Instance Interface
// ============================================================================

/**
 * Instance interface for agents.
 * This defines what an instantiated agent looks like.
 */
export interface AgentInstance<Output, Config = Record<string, unknown>> {
  config: Config
  execute(input: unknown): Promise<Output>
}

// ============================================================================
// Agent Base Class
// ============================================================================

/**
 * Base class for all agents in Syner OS.
 *
 * Subclasses MUST define static properties: name, description, metadata.
 * TypeScript cannot enforce static properties on subclasses, so this is
 * enforced by convention and the AgentStatic interface.
 *
 * @typeParam Output - The type returned by execute()
 * @typeParam Config - The configuration type for this agent
 *
 * @example
 * ```typescript
 * class MyAgent extends Agent<string, MyConfig> {
 *   static readonly name = 'MyAgent'
 *   static readonly description = 'Does something useful'
 *   static readonly metadata: Metadata = {
 *     annotations: { whenToUse: '...', examples: ['...'] }
 *   }
 *
 *   constructor(public config: MyConfig) { super() }
 *
 *   async execute(input: unknown): Promise<string> {
 *     // implementation
 *   }
 * }
 * ```
 */
export abstract class Agent<Output, Config = Record<string, unknown>> {
  /**
   * Instance configuration provided by the user.
   */
  abstract config: Config

  /**
   * Executes the agent's logic.
   *
   * @param input - The input to process
   * @returns A promise resolving to the output
   */
  abstract execute(input: unknown): Promise<Output>
}
