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
 * Si, hemos creado nuestro propio Agent porque necesitamos metadata y otros fields como annotations, y otros valores que iremos implementando y que TODOS los agentes tendran incorporados.
 
 Tienes dos opciones, o verificas si el Agent de ai-sdk permite crearle fields adicionales, o ajustamos nuestro Agent para que extienda el Agent de ai-sdk.Contains annotations and optional fields for documentation, licensing, etc.
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
 * - Workflow: execute() for the run system (timeout, retry, cancel, etc.)
 * - Agent: adds static metadata (name, description, annotations) for Syner
 *
 * @typeParam Output - The type returned by execute()
 * @typeParam Config - The configuration type for this agent
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
 *   async execute(input: unknown): Promise<string> {
 *     // implementation
 *   }
 * }
 * ```
 */
export interface Agent<Output, Config = Record<string, unknown>>
  extends Workflow<Output, Config> {
  /**
   * Instance configuration provided by the user.
   * Required in Agent (optional in Workflow).
   */
  config: Config
}
