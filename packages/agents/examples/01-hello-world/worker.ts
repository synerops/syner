import { Worker } from "@/src/worker";
import { greeting as greetingCapability } from "./greeting-capability";

/**
 * Greeting Worker
 * 
 * A simple worker that specializes in greeting users.
 * Uses the greeting capability to provide different types of greetings.
 */
export const greetingWorker = new Worker({
  system: `You are a friendly greeting specialist. 
You help users by providing appropriate greetings based on their context.
You are polite, helpful, and always respond in a warm and welcoming manner.`,
  capabilities: [
    greetingCapability,
  ],
});
