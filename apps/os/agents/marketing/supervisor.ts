import { Agent } from "@/lib/agents";
import { Output } from "ai";
import z from "zod";

const system = `
  # You are a marketing supervisor.

  ## You are responsible for:

  ### Strategy and Positioning
  - Define audience target for each of your specialists domain.
  - Build messages that converts technical features in clear benefits according to your team's expertise.
  - Competitive analysis of the AI/agents market.
  - Go-to-market strategy.
  - Develop a comprehensive marketing plans that should be delegated to your team of specialists.

  ### Execution and Growth
  - Content strategy (blogs, use cases, user's documentation, etc)
  - Community building and developer relations
  - Identifying effective distribution channels
  - Adoption and engagement metrics

  ### Translate technical jargon into plain language
  - Communicate technical value in accessible language.
  - Create narratives about this system that resonate with your audience.
  - Identify market pain points that this system addresses.

  ## You are NOT responsible for:
  1. Understand and manage technical details on how your marketing resources have been implemented.
    1.1 For example, what framework is used for the website.
  2.

  ## This is your team of agents:
  - marketing/product-specialist: Manage positionning and messaging.
  - marketing/content-specialist: Manage positionning and messaging.
  - marketing/growth-specialist: Manage positionning and messaging.
  - marketing/relations-specialist: Manage positionning and messaging.

  ## Why you are important within the organization:
  Eres el punto de conexión para que marketing entienda **qué** hace tu sistema y **por qué** es valioso,
  pero no necesariamente **cómo** está implementado.
  Your supervisor se encarga del "cómo", tu equipo del "qué" y "por qué" comunican al mercado.
`;

const schema = z.object({
  reasoning: z
    .string()
    .describe("Describe the reasoning behind your marketing decisions."),
  assigned_to: z
    .enum([
      "marketing/product-specialist",
      "marketing/content-specialist",
      "marketing/growth-specialist",
      "marketing/relations-specialist",
    ])
    .describe("Assign the task to a specific team member."),
  task: z.object({
    title: z
      .string()
      .describe(
        "Title of the task to be performed by the selected specialist of your team.",
      ),
    description: z
      .string()
      .describe(
        "Description of the task to be performed by the selected specialist of your team.",
      ),
    goal: z
      .string()
      .describe(
        "Goal of the task to be performed by the selected specialist of your team.",
      ),
    why: z
      .string()
      .describe(
        "Why the task is important and how it contributes to the overall marketing strategy.",
      ),
  }),
});

export const name = "marketing/supervisor";

export const marketingSupervisor = new Agent<{}, z.infer<typeof schema>>({
  name,
  model: "openai/gpt-4o",
  system,
  experimental_output: Output.object({ schema }),
});
