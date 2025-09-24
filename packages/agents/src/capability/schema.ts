import { z } from "zod"

export const CapabilitySchema = z.object({
  name: z.string(),
  description: z.string(),
  tools: z.record(z.object({})),  // Tool type from ai package
  input: z.record(z.unknown()),
  output: z.record(z.unknown()),
  // TODO: support dependencies
  // dependencies: z.array(z.string()).optional(),
})
