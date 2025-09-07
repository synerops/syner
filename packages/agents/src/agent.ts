import { generateObject, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { jsonSchema } from "ai";

type InputSchema = {
  role_identity: {
    display_name: string;
    aliases?: string[];
    tagline?: string;
    emojis?: string[];
  };
  sections: {
    main_functions: Array<{
      title: string;
      items: string[];
    }>;
    professional_analogy?: Array<{
      entity: string;
      description: string;
    }>;
    key_differences?: Array<{
      entity: string;
      focus: string;
    }>;
  };
  conclusion: {
    summary: string;
    call_to_action?: string;
  };
  metadata?: {
    language?: string;
    source?: string;
    // additionalProperties allowed here
    [k: string]: unknown;
  };
};

const schema = jsonSchema<InputSchema>({
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "ai_role_instruction_input",
  type: "object",
  properties: {
    role_identity: {
      type: "object",
      properties: {
        display_name: { type: "string" },
        aliases: { type: "array", items: { type: "string" } },
        tagline: { type: "string" },
        emojis: { type: "array", items: { type: "string" } }
      },
      required: ["display_name"],
      additionalProperties: false
    },
    sections: {
      type: "object",
      properties: {
        main_functions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              items: { type: "array", items: { type: "string" } }
            },
            required: ["title", "items"],
            additionalProperties: false
          }
        },
        professional_analogy: {
          type: "array",
          items: {
            type: "object",
            properties: {
              entity: { type: "string" },
              description: { type: "string" }
            },
            required: ["entity", "description"],
            additionalProperties: false
          }
        },
        key_differences: {
          type: "array",
          items: {
            type: "object",
            properties: {
              entity: { type: "string" },
              focus: { type: "string" }
            },
            required: ["entity", "focus"],
            additionalProperties: false
          }
        }
      },
      required: ["main_functions"],
      additionalProperties: false
    },
    conclusion: {
      type: "object",
      properties: {
        summary: { type: "string" },
        call_to_action: { type: "string" }
      },
      required: ["summary"],
      additionalProperties: false
    },
    metadata: {
      type: "object",
      properties: {
        language: { type: "string" },
        source: { type: "string" }
      },
      // NOTE: metadata allows extra fields
      additionalProperties: true
    }
  },
  required: ["role_identity", "sections", "conclusion"],
  additionalProperties: false
});


export interface AgentConfig {
  id: string;
  name: string;
  user_facing: boolean;
  image: string;
  description: string;
  system: string;
}

export class Agent {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  stream(schema: InputSchema, message: string): Response {
    const result = streamText({
      model: openai('gpt-5-nano'),
      system: this.config.system,
      messages: [
        {
          role: "user",
          content: message,
        },
        {
          role: "user",
          content: JSON.stringify(schema),
        },
      ],
    });

    return result.toUIMessageStreamResponse()
  }

  async generate(message: string) {
    const { object } = await generateObject({
      model: openai('gpt-5-nano'),
      system: this.config.system,
      schema: schema,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    return object
  }
}