import { Experimental_Agent as Agent } from "ai";
import type {
  Experimental_AgentSettings as AgentSettings,
  ToolSet,
  GenerateTextResult,
  Prompt,
} from "ai";
import type { ReasoningStrategy } from "../context";
import type { Plan, PlanStep } from "./planner";

/**
 * Represents the result of executing a step
 */
export interface StepResult {
  stepId: string;
  success: boolean;
  output: string;
  observation?: string;
  error?: string;
}

/**
 * Represents the result of executing a plan
 */
export interface ExecutionResult {
  planId?: string;
  results: StepResult[];
  observations: string[];
  isComplete: boolean;
  requiresReplanning: boolean;
}

/**
 * Output from the Executor agent
 */
export interface ExecutorOutput {
  execution: ExecutionResult;
}

export type ExecutorTools = ToolSet;

export type ExecutorOptions = AgentSettings<ExecutorTools, ExecutorOutput> & {
  strategy: ReasoningStrategy;
};

/**
 * Executor Agent - executes plans with different strategies
 *
 * For ReAct mode: Executes one step, observes, reports back for replanning
 * For ReWOO mode: Executes all steps in batch, observes once at the end
 */
export class Executor extends Agent<ExecutorTools, ExecutorOutput> {
  protected strategy: ReasoningStrategy;

  constructor(options: ExecutorOptions) {
    super({
      ...options,
      system: options.system ?? Executor.getSystemPrompt(options.strategy),
    });
    this.strategy = options.strategy;
  }

  /**
   * Execute a plan according to the strategy
   */
  async execute(
    plan: Plan,
    options?: Prompt,
  ): Promise<GenerateTextResult<ExecutorTools, ExecutorOutput>> {
    if (
      this.strategy.mode === "react" ||
      (this.strategy.mode === "auto" && this.strategy.observeAfterEachAction)
    ) {
      return this.executeReAct(plan, options);
    }

    if (
      this.strategy.mode === "rewoo" ||
      (this.strategy.mode === "auto" && this.strategy.executeInBatch)
    ) {
      return this.executeReWOO(plan, options);
    }

    // Default to ReAct if mode is unclear
    return this.executeReAct(plan, options);
  }

  /**
   * Execute a single step (ReAct mode)
   */
  async executeStep(
    step: PlanStep,
    options?: Prompt,
  ): Promise<GenerateTextResult<ExecutorTools, ExecutorOutput>> {
    const prompt = this.buildExecutionPrompt(step, options);
    return this.generate(prompt);
  }

  /**
   * Execute in ReAct mode: one step at a time with observations
   */
  private async executeReAct(
    plan: Plan,
    options?: Prompt,
  ): Promise<GenerateTextResult<ExecutorTools, ExecutorOutput>> {
    // Find the next step to execute (first one without dependencies or with resolved dependencies)
    const nextStep = this.findNextExecutableStep(plan);

    if (!nextStep) {
      return this.generate({
        prompt: options?.prompt ?? "No executable steps found in plan.",
      });
    }

    return this.executeStep(nextStep, options);
  }

  /**
   * Execute in ReWOO mode: all steps in batch
   */
  private async executeReWOO(
    plan: Plan,
    options?: Prompt,
  ): Promise<GenerateTextResult<ExecutorTools, ExecutorOutput>> {
    const batchPrompt = this.buildBatchExecutionPrompt(plan, options);
    return this.generate(batchPrompt);
  }

  /**
   * Find the next step that can be executed
   */
  private findNextExecutableStep(plan: Plan): PlanStep | null {
    // For now, return the first step
    // In a real implementation, this would check dependencies
    return plan.steps[0] ?? null;
  }

  /**
   * Build execution prompt for a single step
   */
  private buildExecutionPrompt(step: PlanStep, options?: Prompt): Prompt {
    let prompt = `Execute the following step:\n\n`;
    prompt += `ID: ${step.id}\n`;
    prompt += `Action: ${step.action}\n`;
    prompt += `Description: ${step.description}\n`;
    prompt += `Expected Outcome: ${step.expectedOutcome}\n`;

    if (step.dependencies.length > 0) {
      prompt += `\nDependencies: ${step.dependencies.join(", ")}\n`;
    }

    if (options?.prompt) {
      prompt += `\nAdditional Context: ${options.prompt}`;
    }

    prompt += `\n\nExecute this step and report the results.`;
    prompt += `\nInclude observations about what happened.`;

    return { prompt };
  }

  /**
   * Build execution prompt for batch execution
   */
  private buildBatchExecutionPrompt(plan: Plan, options?: Prompt): Prompt {
    let prompt = `Execute the following plan in batch:\n\n`;

    plan.steps.forEach((step, index) => {
      prompt += `\nStep ${index + 1}: ${step.id}\n`;
      prompt += `Action: ${step.action}\n`;
      prompt += `Description: ${step.description}\n`;
      prompt += `Dependencies: ${step.dependencies.join(", ") || "None"}\n`;
    });

    if (options?.prompt) {
      prompt += `\n\nAdditional Context: ${options.prompt}`;
    }

    prompt += `\n\nExecute all steps respecting their dependencies.`;
    prompt += `\nReport results for each step.`;
    prompt += `\nProvide observations only after all steps are complete.`;

    return { prompt };
  }

  /**
   * Get the system prompt for the executor based on strategy
   */
  private static getSystemPrompt(strategy: ReasoningStrategy): string {
    const basePrompt = `You are an Executor agent in an Agentic Operating System.
Your role is to execute plans and report results.

You must output execution results as structured JSON with the following format:
{
  "results": [
    {
      "stepId": "step-id",
      "success": true/false,
      "output": "What was produced",
      "observation": "What you observed",
      "error": "Error message if failed"
    }
  ],
  "observations": ["Overall observations"],
  "isComplete": true/false,
  "requiresReplanning": true/false
}
`;

    if (strategy.mode === "react") {
      return (
        basePrompt +
        `
Mode: ReAct (Reasoning and Action)
- Execute ONE step at a time
- Observe the results carefully
- Report detailed observations
- Flag if replanning is needed based on unexpected results
- Be adaptive to changes
`
      );
    }

    if (strategy.mode === "rewoo") {
      return (
        basePrompt +
        `
Mode: ReWOO (Reasoning Without Observation)
- Execute ALL steps in batch
- Respect dependencies between steps
- Collect all results before reporting
- Provide comprehensive observations only at the end
- Complete the entire plan before reporting
`
      );
    }

    return (
      basePrompt +
      `
Mode: Auto
- Adapt execution style based on the plan
- Use iterative execution for exploratory tasks
- Use batch execution for predictable tasks
- Report observations appropriately
`
    );
  }

  /**
   * Get the strategy being used
   */
  getStrategy(): ReasoningStrategy {
    return { ...this.strategy };
  }

  /**
   * Check if execution requires replanning
   */
  requiresReplanning(result: ExecutionResult): boolean {
    return result.requiresReplanning;
  }

  /**
   * Check if execution is complete
   */
  isComplete(result: ExecutionResult): boolean {
    return result.isComplete;
  }
}
