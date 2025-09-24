import { z } from "zod"
import { ToolSet } from "ai"

export const CapabilitySchema = z.object({
  name: z.string(),
  description: z.string(),
  roles: z.array(z.string()), // Which agent types can use this capability
  tools: z.any() as z.ZodType<ToolSet>, // ToolSet type from ai package
  // input: z.any().optional(),
  // output: z.any().optional(),
  metadata: z.record(z.unknown()).optional(),
  // TODO: support dependencies
  // dependencies: z.array(z.string()).optional(),
})
