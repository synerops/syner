export * from "./reasoning";
import type { Reasoning, ReasoningMode, ReasoningStrategy } from "./reasoning";

export interface Context {
  reasoning: Reasoning;
}

export type { ReasoningMode, ReasoningStrategy };
