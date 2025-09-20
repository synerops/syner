// In general usage, a worker is defined as an entity that executes specific tasks assigned by supervisors or department heads.
// This "work execution" includes task processing, resource management, and reporting capabilities to complete assigned work.
// Example: The worker receives a task from a supervisor, executes it using available resources, and reports progress and results.
// Here, the "worker" depends on task execution, resource management, and reporting capabilities to efficiently complete assigned work.

import { Experimental_Agent as Agent } from "ai";
import { getWorkerTools } from "@/tools/worker";

// Combine all tools from worker capabilities
const tools = getWorkerTools();
const systemPrompt = `You are a worker agent that executes specific tasks assigned to you.
You focus on completing tasks efficiently while managing resources and reporting progress.`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Worker extends Agent<any, any, any> {
  constructor({ system }: { system?: string }) {
    super({
      model: "openai/gpt-4o",
      tools,
      system: system ?? systemPrompt,
    });

    return this;
  }
}
