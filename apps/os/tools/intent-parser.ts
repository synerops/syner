export const intentParser = {
  name: "intent-parser",
  description: "Parse the user's intent",
  parameters: {
    type: "object",
    properties: {
      intent: { type: "string" }
    },
    required: ["intent"]
  }
}