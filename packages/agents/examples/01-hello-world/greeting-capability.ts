import { z } from "zod";
import { tool } from "ai";
import type { Capability } from "@/src/capability";

/**
 * Greeting Capability
 * 
 * Simple capability that allows a worker to greet users
 * with different types of greetings based on context.
 */
export const greeting: Capability = {
  name: "greeting",
  description: "Greet users with different types of greetings based on context",
  metadata: {
    tags: ["greeting", "communication", "basic"],
  },
  tools: {
    greet: tool({
      description: "Generate a greeting message based on the context and user input",
      inputSchema: z.object({
        name: z.string().optional(),
        context: z.enum(["welcome", "hello", "goodbye", "thanks"]).default("hello"),
        language: z.string().default("en"),
      }),
    }),
  },
};
