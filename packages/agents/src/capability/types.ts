import { z } from "zod"
import type { Tool } from "ai"
import { CapabilitySchema } from "./schema"

export type Capability = z.infer<typeof CapabilitySchema>

// Legacy type for backward compatibility
export type LegacyCapability = {
  name: string
  description: string 
  tools: Record<string, Tool>
  input: z.ZodSchema
  output: z.ZodSchema

  // TODO: support dependencies
  // dependencies?: string[]
}