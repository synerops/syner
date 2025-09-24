import { z } from "zod"

export const TaskStatusSchema = z.enum(["pending", "active", "done"])

export const TaskSchema: z.ZodType<any> = z.object({
  id: z.string(),
  title: z.string(),
  goal: z.string(),
  requiredCapabilities: z.array(z.string()),
  dependencies: z.array(
    z.object({
      taskId: z.string(),
      dependsOn: z.string(),
      type: z.enum(["sequential", "parallel", "conditional"]).default("sequential"),
    })
  ),
  metadata: z.record(z.any()),
  status: z.lazy(() => TaskStatusSchema).default("pending"),
  input: z.record(z.unknown()),
  output: z.record(z.unknown()),
})

