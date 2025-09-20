// In general usage, a supervisor is defined as an entity that coordinates and oversees work across others.
// This "oversight" is not limited to people; it can manage agents, workflows, and policies to align outcomes.
// Example: The supervisor decomposes a request into tasks, assigns them to the appropriate heads, and enforces traceability.
// Here, the "supervisor" depends on planning/delegation/audit capabilities, the organizational structure (departments and heads),
// and the system policies that govern how work is planned, assigned, and reported.

<<<<<<< HEAD
import type { GenerateObjectResult, JSONValue } from "ai"
import { generateObject, jsonSchema, ModelMessage } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Task } from "./task.js"
import type { Capability } from "./capability.js"
import { Agent } from "./agent.js"

export enum Capabilities {
  plan = "plan",
  delegate = "delegate",
=======
import { Experimental_Agent as Agent } from "ai";
import { getSupervisorTools } from "@/tools/supervisor";

// Combinar todos los tools de las capabilities del supervisor
const tools = getSupervisorTools();
const systemPrompt = `You are a supervisor agent that manages the other agents.
You can use the other agents to help you with your tasks.`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Supervisor extends Agent<any, any, any> {
  constructor({ system }: { system?: string }) {
    super({
      model: "openai/gpt-4o",
      tools,
      system: system ?? systemPrompt,
    });

    return this;
  }
>>>>>>> 572c19c (feat(agents): lint and build)
}

export const capabilities: Capability[] = [
  {
    name: Capabilities.plan,
    description: "Analyze the request, break it down into subtasks and define an action plan",
    tools: [],
    input: jsonSchema({
      type: "object",
    }),
    output: jsonSchema({
      type: "object",
    }),
  },
  {
    name: Capabilities.delegate,
    description: "Delegate the subtasks to the appropriate agents",
    tools: [],
    input: jsonSchema({
      type: "object",
    }),
    output: jsonSchema({
      type: "object",
    }),
  }
]

interface SupervisorResponsibilities {
  delegateTask(task: Task, agent: Agent): Promise<JSONValue | Error>
}

export class Supervisor extends Agent implements SupervisorResponsibilities {
  constructor() {
    super({
      id: "supervisor",
      name: "Supervisor",
      capabilities,
    })
  }

  // Analyze the request and return the intent
  protected async analyzeRequest(request: string): Promise<JSONValue | Error> {
    try {

      return this.generate(prompt);
    } catch (error) {
      console.error(error)
      return error as Error
    }
  }

  private async createPlan(request: string): Promise<Task[]> {
    try {
      // Analyze the request and return the intent
      const intentResult = await this.analyzeRequest(request)
      
      if (intentResult instanceof Error) {
        console.error("Error analyzing request:", intentResult)
        return []
      }

      // Decompose the user's intent into tasks
      return this.decomposeIntentIntoTasks(intentResult.object)
    } catch (error) {
      console.error(error)
      return []
    }
  } 

  private async delegateTask(task: Task, agent: Agent): Promise<JSONValue | Error> {
    try {
      if (!this.can(Capabilities.delegate)) {
        console.error(`Supervisor cannot delegate the task ${task.name}`)
        throw new Error("Supervisor cannot execute this task because it does not have the required capability")
      }

      
      // Check if the agent can execute the task
      if (!agent.can(task.capability)) {
        console.error(`Agent ${agent.id} cannot execute the task ${task.name}`)
        throw new Error("Agent cannot execute this task because it does not have the required capability")
      }

      return agent.execute(task)
    } catch (error) {
      return error as Error
    }
  }

  private async decomposeIntentIntoTasks(intent: JSONValue): Promise<Task[]> {
    console.log("intent", intent)
    throw new Error("Not implemented")
  }

  async handle(prompt: string): Promise<JSONValue> {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      system: "You are a supervisor. You are responsible for analyzing the request and returning the intent that the user is trying to express.",
      prompt,
      schema: jsonSchema({
        type: "object",
        properties: {
          intent: { type: "string" },
          requireFinanceApproval: { type: "boolean" },
          questions: { type: "array", items: { type: "string" } },
          indicationsToDelegate: { type: "array", items: { type: "string" } },
          tasks: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              goal: { type: "string" },
              status: {
                type: "string",
                enum: ["pending", "active", "done"]
              },
              input: { type: "object" },
              output: { type: "object" }
            },
            required: ["id", "name", "goal", "status"]
          },
        },
        required: ["intent"],
        additionalProperties: false,
      }),
    })

    return object
  }
}