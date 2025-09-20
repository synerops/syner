export const workflowPlanner = {
  name: "workflow-planner",
  description: "Plan the workflow",
  parameters: {
    type: "object",
    properties: {
      workflow: { type: "string" }
    },
    required: ["workflow"]
  },
  required: ["workflow"]
}