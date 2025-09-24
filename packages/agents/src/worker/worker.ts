import { Experimental_Agent as Agent, InferUITools, type ToolSet } from "ai";
import { z } from "zod";
import type { Task } from "@/src/task";
import type { WorkerConfig } from "./types";

import { taskExecution } from "@/capabilities/worker";

const tools = {
  ...taskExecution.tools,
} satisfies ToolSet;

const SYSTEM_PROMPT = `
You are a worker agent that executes specific tasks assigned to you. 
You focus on completing tasks efficiently while managing resources and reporting progress.
You use the following capabilities:
- Task Execution: Execute specific tasks with domain expertise and tools
- Input Validation: Validate task parameters before execution
- Error Handling: Handle and recover from execution errors
- Optimization: Optimize execution based on available resources
`;

export class Worker extends Agent<ToolSet> {
  constructor(config: WorkerConfig) {
    super({
      model: "openai/gpt-4o",
      tools,
      system: config.system ?? SYSTEM_PROMPT
    });
  }

  async executeTask(task: Task): Promise<string> {
    throw new Error("Not implemented");
  }

  async validateInput(task: Task): Promise<boolean> {
    throw new Error("Not implemented");
  }

  async handleError(error: Error, task: Task): Promise<void> {
    throw new Error("Not implemented");
  }
}
