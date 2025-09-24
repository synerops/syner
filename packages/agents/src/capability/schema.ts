// In general usage, capability is defined as the ability to do something. 
// This "ability" is not limited to what is innate but can come from external tools, acquired knowledge, or processes.
// Example: The company has the capability to produce 10,000 units per day.
// Here, the "capability" depends on machinery(tools), workers, and know - how.

import { z } from "zod"
import type { Tool } from "ai"

export const CapabilitySchema = z.object({
  name: z.string(),
  description: z.string(),
  tools: z.record(z.any()), // Tool type from ai package
  input: z.any(), // z.ZodSchema
  output: z.any(), // z.ZodSchema
  // TODO: support dependencies
  // dependencies: z.array(z.string()).optional(),
})
