import { z } from "zod"

export const CapabilitySchema = z.object({
  name: z.string(),
  description: z.string(),
  tools: z.record(z.object({})),  // Tool type from ai package
  input: z.any(),
  output: z.any(),
  // TODO: support dependencies
  // dependencies: z.array(z.string()).optional(),
})
