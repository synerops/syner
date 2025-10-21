import type {
  Experimental_AgentSettings as AgentSettings,
  GenerateTextResult,
  Prompt,
  ToolSet,
} from "ai";
import { Experimental_Agent as Agent } from "ai";

// Re-export memory types and base provider
export type {
  Memory,
  MemoryContext,
  MemorySearchOptions
} from "./memory";
export {
  DefaultMemoryProvider
} from "./memory";

// Context Type (for backward compatibility)
export type Context = Record<string, unknown>;

// Guideline System
export interface Guideline {
  id: string;
  condition: string;
  action: string;
  apis: string[];
  priority?: number;
}

// Context Output
export interface ContextOutput {
  data: Record<string, unknown>;
  sources: string[];
  confidence: number;
}

export type ContextTools = ToolSet;
export type ContextSettings = AgentSettings<
  ContextTools,
  ContextOutput
> & {
  guidelines?: Guideline[];
};

// Context Agent Interface
export interface ContextAgent extends Agent<
  ContextTools,
  ContextOutput
> {
  guidelines: Map<string, Guideline>;
  apiRegistry: Map<string, unknown>;

  // Main method: intelligent context gathering
  gather(
    query: string | Prompt,
    options?: { context?: Record<string, unknown> }
  ): Promise<GenerateTextResult<ContextTools, ContextOutput>>;

  // Guideline management
  createGuideline(guideline: Omit<Guideline, "id">): string;
  removeGuideline(id: string): boolean;

  // API registry management
  registerAPI(name: string, api: unknown): void;
  getAPI(name: string): unknown;
  getAvailableAPIs(): string[];
}

/**
 * DefaultContextAgent
 *
 * Intelligent agent that decides HOW and WHERE to gather context
 * based on user request and configured guidelines.
 */
export class DefaultContextAgent
  extends Agent<
    ContextTools,
    ContextOutput
  >
  implements ContextAgent
{
  #guidelines: Map<string, Guideline>;
  #apiRegistry: Map<string, unknown>;

  constructor(settings: ContextSettings) {
    super(settings);
    this.#guidelines = new Map();
    this.#apiRegistry = new Map();

    // Load initial guidelines
    settings.guidelines?.forEach((g) => {
      this.#guidelines.set(g.id, g);
    });
  }

  /**
   * Main gathering method - the agent decides what to do
   */
  async gather(
    query: string | Prompt,
    options?: { context?: Record<string, unknown> }
  ): Promise<
    GenerateTextResult<ContextTools, ContextOutput>
  > {
    const prompt: Prompt =
      typeof query === "string"
        ? { messages: [{ role: "user", content: query }] }
        : query;

    // Build system prompt with all guidelines (LLM decides which to apply)
    const systemPrompt = this.#buildSystemPrompt();

    return this.generate({
      ...prompt,
      system: systemPrompt,
      ...options,
    });
  }

  /**
   * Create a guideline to make reasoning predictable
   */
  createGuideline(guideline: Omit<Guideline, "id">): string {
    const id = `guideline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.#guidelines.set(id, { ...guideline, id });
    return id;
  }

  removeGuideline(id: string): boolean {
    return this.#guidelines.delete(id);
  }

  /**
   * Register an API in the internal registry
   */
  registerAPI(name: string, api: unknown): void {
    this.#apiRegistry.set(name, api);

    // Make API accessible as property (e.g., agent.memory)
    Object.defineProperty(this, name, {
      get: () => api,
      enumerable: true,
      configurable: true,
    });
  }

  /**
   * Get an API from the registry
   */
  getAPI(name: string): unknown {
    return this.#apiRegistry.get(name);
  }

  /**
   * Get list of available API names
   */
  getAvailableAPIs(): string[] {
    return Array.from(this.#apiRegistry.keys());
  }

  #buildSystemPrompt(): string {
    let prompt = `You are a Context Agent. Build knowledge and understanding.

WHAT YOU DO:
- Read from sources (filesystem, git, databases, APIs)
- Store contextual knowledge (memory, cache)
- Search and retrieve information
- Return null for missing data, throw only for system errors

WHAT YOU DON'T DO:
- Execute real-world operations (use actions API)
- Modify external systems
- Send notifications or trigger workflows
`;

    // Add available APIs section
    const availableAPIs = this.getAvailableAPIs();
    if (availableAPIs.length > 0) {
      prompt += `AVAILABLE APIs: ${availableAPIs.join(", ")}\n`;
    }

    // Pass ALL guidelines to LLM (sorted by priority for context)
    const allGuidelines = Array.from(this.#guidelines.values())
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    if (allGuidelines.length > 0) {
      prompt += `\nGUIDELINES:\n`;
      allGuidelines.forEach((g) => {
        prompt += `- WHEN: ${g.condition}\n  THEN: ${g.action}\n  USE: ${g.apis.join(", ")}\n`;
      });
    }

    prompt += `\nOUTPUT: { data: {...}, sources: [...], confidence: 0-1 }`;

    return prompt;
  }

  get guidelines(): Map<string, Guideline> {
    return this.#guidelines;
  }

  get apiRegistry(): Map<string, unknown> {
    return this.#apiRegistry;
  }
}
