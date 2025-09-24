// In general usage, a plan is defined as a structured collection of tasks organized to achieve a specific goal.
// This "organization" involves sequencing, dependencies, and coordination to ensure successful execution.
// Example: The plan contains multiple tasks with defined dependencies, timelines, and resource requirements.
// Here, the "plan" depends on task definitions, dependency management, and execution coordination
// to ensure that complex workflows are executed in the correct order and with proper resource allocation.

import { z } from "zod";
import { TaskSchema } from "../task/schema";

// Plan schema following the same pattern as capabilities
export const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tasks: z.array(TaskSchema),
  dependencies: z.array(z.object({
    from: z.string(),
    to: z.string(),
    type: z.enum(["sequential", "parallel", "conditional"]).default("sequential"),
  })),
  metadata: z.object({
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    estimatedDuration: z.string().optional(),
    requiredCapabilities: z.array(z.string()).optional(),
    environment: z.enum(["development", "staging", "production"]).default("development"),
  }),
  status: z.enum(["draft", "ready", "executing", "completed", "failed"]).default("draft"),
});

// Plan execution result schema
export const PlanExecutionResultSchema = z.object({
  planId: z.string(),
  status: z.enum(["success", "partial_success", "failed"]),
  completedTasks: z.array(z.string()),
  failedTasks: z.array(z.string()),
  executionTime: z.number(), // milliseconds
  results: z.array(z.object({
    taskId: z.string(),
    status: z.enum(["completed", "failed", "skipped"]),
    output: z.any().optional(),
    error: z.string().optional(),
  })),
  summary: z.string(),
});

// Plan builder class for creating plans programmatically
export class PlanBuilder {
  private plan: Partial<z.infer<typeof PlanSchema>>;

  constructor(id: string, name: string, description: string) {
    this.plan = {
      id,
      name,
      description,
      tasks: [],
      dependencies: [],
      metadata: {
        priority: "medium",
        environment: "development",
      },
      status: "draft",
    };
  }

  addTask(task: z.infer<typeof TaskSchema>): PlanBuilder {
    this.plan.tasks!.push(task);
    return this;
  }

  addDependency(from: string, to: string, type: "sequential" | "parallel" | "conditional" = "sequential"): PlanBuilder {
    this.plan.dependencies!.push({ from, to, type });
    return this;
  }

  setPriority(priority: "low" | "medium" | "high" | "urgent"): PlanBuilder {
    this.plan.metadata!.priority = priority;
    return this;
  }

  setEnvironment(environment: "development" | "staging" | "production"): PlanBuilder {
    this.plan.metadata!.environment = environment;
    return this;
  }

  setEstimatedDuration(duration: string): PlanBuilder {
    this.plan.metadata!.estimatedDuration = duration;
    return this;
  }

  setRequiredCapabilities(capabilities: string[]): PlanBuilder {
    this.plan.metadata!.requiredCapabilities = capabilities;
    return this;
  }

  build(): z.infer<typeof PlanSchema> {
    const validatedPlan = PlanSchema.parse(this.plan);
    return validatedPlan;
  }
}
