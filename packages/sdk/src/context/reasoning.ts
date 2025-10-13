/**
 * Reasoning modes for agent orchestration
 * - react: Reasoning + Action interleaved (iterative with observations)
 * - rewoo: Reasoning Without Observation (plan all, execute batch)
 * - auto: System chooses based on task complexity
 */
export type ReasoningMode = "react" | "rewoo" | "auto";

/**
 * Configuration for reasoning strategy
 */
export interface ReasoningStrategy {
  mode: ReasoningMode;

  // ReAct specific configuration
  maxIterations?: number;
  observeAfterEachAction?: boolean;

  // ReWOO specific configuration
  planUpfront?: boolean;
  executeInBatch?: boolean;

  // Shared configuration
  requiresApproval?: boolean;
  requiresVerification?: boolean;
}

export class Reasoning {
  private _strategy: ReasoningStrategy;

  constructor(config?: Partial<ReasoningStrategy>) {
    this._strategy = {
      mode: config?.mode ?? "auto",
      maxIterations: config?.maxIterations ?? 5,
      observeAfterEachAction: config?.observeAfterEachAction ?? true,
      planUpfront: config?.planUpfront ?? false,
      executeInBatch: config?.executeInBatch ?? false,
      requiresApproval: config?.requiresApproval ?? false,
      requiresVerification: config?.requiresVerification ?? true,
    };
  }

  static createReasoning(overrides?: Partial<ReasoningStrategy>): Reasoning {
    return new Reasoning(overrides);
  }

  /**
   * Create a ReAct strategy (iterative reasoning with observations)
   */
  static react(config?: Omit<Partial<ReasoningStrategy>, "mode">): Reasoning {
    return new Reasoning({
      ...config,
      mode: "react",
      observeAfterEachAction: true,
      maxIterations: config?.maxIterations ?? 5,
    });
  }

  /**
   * Create a ReWOO strategy (plan everything upfront, execute in batch)
   */
  static rewoo(config?: Omit<Partial<ReasoningStrategy>, "mode">): Reasoning {
    return new Reasoning({
      ...config,
      mode: "rewoo",
      planUpfront: true,
      executeInBatch: true,
    });
  }

  /**
   * Create an auto strategy (system decides based on task)
   */
  static auto(config?: Omit<Partial<ReasoningStrategy>, "mode">): Reasoning {
    return new Reasoning({
      ...config,
      mode: "auto",
    });
  }

  getStrategy(): ReasoningStrategy {
    return { ...this._strategy };
  }

  getMode(): ReasoningMode {
    return this._strategy.mode;
  }

  setStrategy(strategy: Partial<ReasoningStrategy>): void {
    this._strategy = { ...this._strategy, ...strategy };
  }

  requiresPlanning(): boolean {
    return (
      this._strategy.mode === "rewoo" || this._strategy.planUpfront === true
    );
  }

  setRequiresPlanning(value: boolean): void {
    this._strategy.planUpfront = value;
  }

  isReActMode(): boolean {
    return this._strategy.mode === "react";
  }

  isReWOOMode(): boolean {
    return this._strategy.mode === "rewoo";
  }

  isAutoMode(): boolean {
    return this._strategy.mode === "auto";
  }

  shouldObserveAfterEachAction(): boolean {
    return this._strategy.observeAfterEachAction ?? false;
  }

  shouldExecuteInBatch(): boolean {
    return this._strategy.executeInBatch ?? false;
  }

  getMaxIterations(): number {
    return this._strategy.maxIterations ?? 5;
  }

  // TODO: Add configure() method that accepts Zod schema
  // TODO: Add OpenAPI schema for CLI configuration
  // This will allow overriding defaults from CLI or config files
}
