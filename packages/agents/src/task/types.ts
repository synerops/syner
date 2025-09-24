import { z } from "zod"
import { TaskSchema } from "./schema"

export type Task = z.infer<typeof TaskSchema>
export type Status = "pending" | "active" | "done"
