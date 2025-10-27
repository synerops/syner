import type {
  Experimental_AgentSettings as AgentSettings,
  Prompt,
  ToolSet,
} from "ai"
import { Experimental_Agent as Agent, jsonSchema, Output } from "ai"

import type { Context } from "../context"

export interface SummarizationOutput {
  readonly summary: string
  readonly reasoning: string
}

export type SummarizerSettings = AgentSettings<
  ToolSet,
  SummarizationOutput,
  Partial<SummarizationOutput>
>

export interface Summarizer
  extends Agent<ToolSet, SummarizationOutput, Partial<SummarizationOutput>> {
  summarize(
    options: Prompt & {
      context: Context
    }
  ): ReturnType<Agent<ToolSet, SummarizationOutput>["generate"]>
}

export class DefaultSummarizer
  extends Agent<ToolSet, SummarizationOutput, Partial<SummarizationOutput>>
  implements Summarizer
{
  constructor(settings: SummarizerSettings) {
    super({
      ...settings,
      experimental_output: Output.object<SummarizationOutput>({
        schema: jsonSchema<SummarizationOutput>({
          type: "object",
          properties: {
            summary: { type: "string" },
            reasoning: { type: "string" },
          },
          required: ["summary", "reasoning"],
        }),
      }),
    })
  }

  summarize(
    options: Prompt & {
      context: Context
    }
  ) {
    return this.generate(options)
  }
}
