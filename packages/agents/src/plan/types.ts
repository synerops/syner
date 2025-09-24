import { z } from "zod";
import { PlanSchema, PlanExecutionResultSchema } from "./schema";

export type Plan = z.infer<typeof PlanSchema>;
export type PlanExecutionResult = z.infer<typeof PlanExecutionResultSchema>;
