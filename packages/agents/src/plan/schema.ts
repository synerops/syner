import { z } from "zod";
import { TaskSchema } from "@/src/task/schema";

export const PlanStatusSchema = z.enum(
  ["draft", "in-review", "approved", "rejected"]
)

// Plan schema following the same pattern as capabilities
export const PlanSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  taskIds: z.array(z.string()),
  dependencies: z.array(
    z.object({
      taskId: z.string(),
      dependsOn: z.string(),
      type: z.enum(["sequential", "parallel", "conditional"]).optional().default("sequential"),
    })
  ),
  metadata: z.record(z.any()),
  status: z.lazy(() => PlanStatusSchema).default("draft"),
});

export const PlanExecutionStatusSchema = z.enum(
  ["pending", "in-progress", "paused", "completed"]
)

// Plan execution result schema
export const PlanExecutionResultSchema = z.object({
  executionId: z.string().uuid(),
  planId: z.string(),
  status: z.lazy(() => PlanExecutionStatusSchema),
  input: z.any(),
  output: z.any(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  reason: z.enum(["cancelled", "failed", "success"]).optional(),
  metadata: z.record(z.any()),
});

// Plan builder class for creating plans programmatically
export class Planner {
  private plan: Partial<z.infer<typeof PlanSchema>>;

  constructor({
    id, title, description, taskIds, dependencies, metadata
  }: {
    id: string;
    title: string;
    description: string;
    taskIds: string[];
    dependencies?: z.infer<typeof PlanSchema>['dependencies'];
    metadata?: z.infer<typeof PlanSchema>['metadata'];
  }) {
    this.plan = {
      id,
      title,
      description,
      taskIds,
      dependencies: dependencies || [],
      metadata: metadata || {},
    };
  }

  addTaskId(taskId: string): Planner {
    this.plan.taskIds!.push(taskId);
    return this;
  }

  addDependency(taskId: string, dependsOn: string, type: "sequential" | "parallel" | "conditional" = "sequential"): Planner {
    this.plan.dependencies!.push({ taskId, dependsOn, type });
    return this;
  }

  setMetadata(metadata: z.infer<typeof PlanSchema>['metadata']): Planner {
    this.plan.metadata = metadata;
    return this;
  }

  draft(): z.infer<typeof PlanSchema> {
    return PlanSchema.parse(this.plan);
  }
}
