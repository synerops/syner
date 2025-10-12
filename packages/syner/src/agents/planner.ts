import { Experimental_Agent as Agent } from "ai";
import type {
  Experimental_AgentSettings as AgentSettings,
  ToolSet,
  GenerateTextResult,
  Prompt,
} from "ai";
import type { ReasoningStrategy } from "../context";

/**
 * Represents a single step in an execution plan
 */
export interface PlanStep {
  id: string;
  description: string;
  action: string;
  dependencies: string[];
  expectedOutcome: string;
}

/**
 * Represents a complete execution plan
 */
export interface Plan {
  steps: PlanStep[];
  strategy: ReasoningStrategy;
  isComplete: boolean;
}

/**
 * Output from the Planner agent
 */
export interface PlannerOutput {
  plan: Plan;
}

export type PlannerTools = ToolSet;

export type PlannerOptions = AgentSettings<PlannerTools, PlannerOutput> & {
  strategy: ReasoningStrategy;
};

/**
 * Planner Agent - generates execution plans based on reasoning strategy
 *
 * For ReAct mode: Plans next step based on current observations
 * For ReWOO mode: Plans all steps upfront without intermediate observations
 */
export class Planner extends Agent<PlannerTools, PlannerOutput> {
  protected strategy: ReasoningStrategy;

  constructor(options: PlannerOptions) {
    super({
      ...options,
      system: options.system ?? Planner.getSystemPrompt(options.strategy),
    });
    this.strategy = options.strategy;
  }

  /**
   * Generate a plan based on the current prompt and context
   */
  async plan(
    options: Prompt & {
      observations?: string[];
      previousSteps?: PlanStep[];
    },
  ): Promise<GenerateTextResult<PlannerTools, PlannerOutput>> {
    const enhancedPrompt = this.buildPlanningPrompt(options);
    return this.generate(enhancedPrompt);
  }

  /**
   * Build the planning prompt based on strategy and context
   */
  private buildPlanningPrompt(
    options: Prompt & {
      observations?: string[];
      previousSteps?: PlanStep[];
    },
  ): Prompt {
    const { prompt, observations, previousSteps } = options;

    // Handle both string and message array formats
    const basePrompt = typeof prompt === "string" ? prompt : "";
    let enhancedPrompt = basePrompt;

    // Add context for ReAct mode
    if (this.strategy.mode === "react") {
      if (observations && observations.length > 0) {
        enhancedPrompt += "\n\nPrevious observations:\n";
        enhancedPrompt += observations
          .map((obs, i) => `${i + 1}. ${obs}`)
          .join("\n");
      }

      if (previousSteps && previousSteps.length > 0) {
        enhancedPrompt += "\n\nPrevious steps completed:\n";
        enhancedPrompt += previousSteps
          .map((step, i) => `${i + 1}. ${step.description} (${step.id})`)
          .join("\n");
      }

      enhancedPrompt +=
        "\n\nPlan the NEXT step to take based on the observations.";
    }

    // Add context for ReWOO mode
    if (this.strategy.mode === "rewoo") {
      enhancedPrompt +=
        "\n\nCreate a COMPLETE execution plan with all steps needed to accomplish the goal.";
      enhancedPrompt +=
        "\nEach step should be independent and executable in batch.";
      enhancedPrompt += "\nConsider all dependencies between steps.";
    }

    // Add context for auto mode
    if (this.strategy.mode === "auto") {
      enhancedPrompt += "\n\nAnalyze the task and determine whether to:";
      enhancedPrompt += "\n- Use ReAct approach (iterative, exploratory tasks)";
      enhancedPrompt += "\n- Use ReWOO approach (batch, predictable tasks)";
      enhancedPrompt += "\nThen create an appropriate plan.";
    }

    // Return properly formatted Prompt
    if (typeof prompt === "string") {
      return { prompt: enhancedPrompt };
    }
    return options;
  }

  /**
   * Get the system prompt for the planner based on strategy
   */
  private static getSystemPrompt(strategy: ReasoningStrategy): string {
    const basePrompt = `You are a Planner agent in an Agentic Operating System.
Your role is to analyze tasks and create execution plans.

You must output plans as structured JSON with the following format:
{
  "steps": [
    {
      "id": "unique-step-id",
      "description": "What this step does",
      "action": "The specific action to execute",
      "dependencies": ["list-of-step-ids"],
      "expectedOutcome": "What should happen after this step"
    }
  ]
}
`;

    if (strategy.mode === "react") {
      return (
        basePrompt +
        `
Mode: ReAct (Reasoning and Action)
- Plan ONE next step at a time
- Consider previous observations
- Adapt plan based on feedback
- Be ready to change course if needed
`
      );
    }

    if (strategy.mode === "rewoo") {
      return (
        basePrompt +
        `
Mode: ReWOO (Reasoning Without Observation)
- Plan ALL steps upfront
- Create a complete execution plan
- Steps should be executable in batch
- Consider dependencies carefully
- No intermediate observations will be available
`
      );
    }

    return (
      basePrompt +
      `
Mode: Auto
- Analyze the task complexity
- Choose between ReAct (iterative) or ReWOO (batch)
- Create an appropriate plan for the chosen approach
`
    );
  }

  /**
   * Check if the current plan is complete
   */
  isComplete(plan: Plan): boolean {
    return plan.isComplete;
  }

  /**
   * Get the strategy being used
   */
  getStrategy(): ReasoningStrategy {
    return { ...this.strategy };
  }
}
