import type {
  Experimental_AgentSettings as AgentSettings,
  Prompt,
  ToolSet,
} from "ai";
import { Experimental_Agent as Agent, jsonSchema, Output } from "ai";

import type { Context } from "../context";
import type { PlannerOutput } from "./planner";

export interface CoordinationOutput {
  plan?: string;
  readonly planRequiresSummary?: boolean;
  summary?: string;
  metadata?: Record<string, unknown>;
}

export type CoordinatorSettings = AgentSettings<
  ToolSet, 
  CoordinationOutput, 
  Partial<CoordinationOutput>
>;

export interface Coordinator extends Agent<
  ToolSet, 
  CoordinationOutput, 
  Partial<CoordinationOutput>
> {
  coordinate(
    options: Prompt & {
      context: Context;
    },
  ): ReturnType<Agent<ToolSet, CoordinationOutput>["generate"]>;
}

export class DefaultCoordinator
  extends Agent<
    ToolSet, 
    CoordinationOutput, 
    Partial<CoordinationOutput>
  >
  implements Coordinator
{
  constructor(settings: CoordinatorSettings) {
    super({
      ...settings,
      experimental_output: Output.object<CoordinationOutput>({
        schema: jsonSchema<CoordinationOutput>({
          type: "object",
          properties: {
            plan: { 
              type: "object", 
              properties: { 
                details: { type: "string" }, 
                requiresSummary: { type: "boolean" } 
              }, 
              required: ["details", "requiresSummary"] 
            },
            summary: { type: "string" },
            metadata: { type: "object" }
          },
          required: ["plan", "summary"],
        }),
      }),
    });
  }

  coordinate(
    options: Prompt & {
      context: Context;
    },
  ): ReturnType<Agent<ToolSet, CoordinationOutput>["generate"]> {
    return this.generate(options);
  }
}
