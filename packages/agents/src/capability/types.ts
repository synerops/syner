import { z } from "zod"
import { CapabilitySchema } from "./schema"

export type Capability = z.infer<typeof CapabilitySchema>