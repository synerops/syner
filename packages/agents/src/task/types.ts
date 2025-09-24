import { z } from "zod"
import { TaskSchema, TaskStatusSchema } from "./schema"

export type Task = z.infer<typeof TaskSchema>
export type TaskStatus = z.infer<typeof TaskStatusSchema>
