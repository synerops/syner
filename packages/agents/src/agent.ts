import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export class Agent {
  private readonly id: string = crypto.randomUUID();
  private readonly name: string;
  private readonly description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  async run(input: string) {
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: input,
    })
    return result.text;
  }
}