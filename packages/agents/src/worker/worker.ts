// In general usage, a worker is defined as an entity that executes specific tasks assigned by orchestrators or department heads.
// This "work execution" includes task processing, resource management, and reporting capabilities to complete assigned work.
// Example: The worker receives a task from an orchestrator, executes it using available resources, and reports progress and results.
// Here, the "worker" depends on task execution, resource management, and reporting capabilities to efficiently complete assigned work.

import { Experimental_Agent as Agent } from "ai";
import { getWorkerTools, type WorkerTools } from "@/tools";
import type { Task } from "@/src/task";
import type { WorkerConfig } from "./types";

export class Worker extends Agent<WorkerTools> {
  constructor(config: WorkerConfig) {
    super({
      model: "openai/gpt-4o",
      tools: getWorkerTools(),
      system: config.system ?? "You are a worker agent that executes specific tasks assigned to you. You focus on completing tasks efficiently while managing resources and reporting progress."
    });
  }

  async executeTask(task: Task): Promise<string> {
    throw new Error("Not implemented");
  }
}
