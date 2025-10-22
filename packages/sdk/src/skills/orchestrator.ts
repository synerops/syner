import type {
  Experimental_AgentSettings as AgentSettings,
  GenerateTextResult,
  Prompt,
  ToolSet,
} from "ai"
import { Experimental_Agent as Agent } from "ai"

import type { Context } from "../context"

import type { ClassificationOutput, Classifier } from "./classifier"
import { DefaultClassifier } from "./classifier"

import type { CoordinationOutput, Coordinator } from "./coordinator"
import { DefaultCoordinator } from "./coordinator"

import type { Planner, PlannerOutput } from "./planner"
import { DefaultPlanner } from "./planner"

import type { SummarizationOutput, Summarizer } from "./summarizer"
import { DefaultSummarizer } from "./summarizer"

// # Orchestrator Team
export interface OrchestratorTeam {
  classifier: Classifier
  coordinator: Coordinator
  planner: Planner
  summarizer: Summarizer
}

export type OrchestratorTools = ToolSet

export interface OrchestratorOutput {
  plan?: Partial<PlannerOutput>
}

export type OrchestratorSettings = AgentSettings<
  OrchestratorTools,
  OrchestratorOutput
> & {
  team?: Partial<OrchestratorTeam>
}

export interface Orchestrator
  extends Agent<OrchestratorTools, OrchestratorOutput> {
  agents: Map<string, Agent<ToolSet, unknown>>
  team: OrchestratorTeam

  classify(
    options: Prompt & {
      context: Context
    }
  ): Promise<GenerateTextResult<ToolSet, ClassificationOutput>>

  coordinate(
    options: Prompt & {
      context: Context
    }
  ): Promise<GenerateTextResult<ToolSet, CoordinationOutput>>

  summarize(
    options: Prompt & {
      context: Context
    }
  ): Promise<GenerateTextResult<ToolSet, SummarizationOutput>>

  orchestrate(
    options: Prompt & {
      context: Context
    }
  ): Promise<GenerateTextResult<ToolSet, unknown>>
}

/**
 * @implements Orchestrator
 */
export class DefaultOrchestrator
  extends Agent<OrchestratorTools, OrchestratorOutput>
  implements Orchestrator
{
  #team: OrchestratorTeam

  constructor(settings: OrchestratorSettings) {
    super(settings)

    // Extract base settings without experimental_output
    const { experimental_output: _, team: _team, ...baseSettings } = settings

    // Initialize team with provided agents or create default instances
    this.#team = {
      classifier:
        settings.team?.classifier ??
        (new DefaultClassifier(baseSettings) as Classifier),
      coordinator:
        settings.team?.coordinator ??
        (new DefaultCoordinator(baseSettings) as Coordinator),
      planner:
        settings.team?.planner ?? (new DefaultPlanner(baseSettings) as Planner),
      summarizer:
        settings.team?.summarizer ??
        (new DefaultSummarizer(baseSettings) as Summarizer),
    }
  }

  async classify(
    options: Prompt & { context: Context }
  ): Promise<GenerateTextResult<ToolSet, ClassificationOutput>> {
    return this.#team.classifier.classify(options)
  }

  async coordinate(
    options: Prompt & { context: Context }
  ): Promise<GenerateTextResult<ToolSet, CoordinationOutput>> {
    return this.#team.coordinator.coordinate(options)
  }

  async summarize(
    options: Prompt & { context: Context }
  ): Promise<GenerateTextResult<ToolSet, SummarizationOutput>> {
    return this.#team.summarizer.summarize(options)
  }

  async orchestrate(
    options: Prompt & { context: Context }
  ): Promise<GenerateTextResult<ToolSet, unknown>> {
    // classify the request of the user
    const { experimental_output: classification } = await this.classify(options)

    if (classification.isSimple) {
      if (!Object.keys(this.#team).includes(classification.agentName)) {
        throw new Error(`Agent ${classification.agentName} not found`)
      }

      // route the request to the appropriate agent
      const agent =
        this.#team[classification.agentName as keyof OrchestratorTeam]
      if (!agent) {
        throw new Error(`Agent ${classification.agentName} not found`)
      }

      console.log(`Routing request to ${classification.agentName}...`)
      return agent.generate(options)
    }

    // request requires coordination
    const { experimental_output: coordination } = await this.coordinate(options)

    // request requires summarization
    if (coordination.planRequiresSummary) {
      return await this.summarize(options)
    }

    return this.generate(options)
  }

  set team(value: Partial<OrchestratorTeam>) {
    this.#team = {
      ...this.#team,
      ...value,
    }
  }

  get team(): OrchestratorTeam {
    return this.#team
  }

  // Backward compatibility getter for agents
  get agents(): Map<string, Agent<ToolSet, unknown>> {
    return new Map([
      [
        "classifier",
        this.#team.classifier as unknown as Agent<ToolSet, unknown>,
      ],
      [
        "coordinator",
        this.#team.coordinator as unknown as Agent<ToolSet, unknown>,
      ],
      ["planner", this.#team.planner as unknown as Agent<ToolSet, unknown>],
      [
        "summarizer",
        this.#team.summarizer as unknown as Agent<ToolSet, unknown>,
      ],
    ])
  }
}
