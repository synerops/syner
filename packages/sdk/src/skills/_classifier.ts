// import type {
//   Experimental_AgentSettings as AgentSettings,
//   Prompt,
//   ToolSet,
// } from "ai"
// import { Experimental_Agent as Agent, jsonSchema, Output } from "ai"

// import type { Context } from "../context"

// export interface ClassificationOutput {
//   agentName: string
//   prompt: string
//   context: string
//   isSimple: boolean
// }

// export type ClassifierSettings = AgentSettings<
//   ToolSet,
//   ClassificationOutput,
//   Partial<ClassificationOutput>
// >

// export interface Classifier
//   extends Agent<ToolSet, ClassificationOutput, Partial<ClassificationOutput>> {
//   classify(
//     options: Prompt & {
//       context: Context
//     }
//   ): ReturnType<Agent<ToolSet, ClassificationOutput>["generate"]>
// }

// export class DefaultClassifier
//   extends Agent<ToolSet, ClassificationOutput, Partial<ClassificationOutput>>
//   implements Classifier
// {
//   constructor(settings: ClassifierSettings) {
//     super({
//       ...settings,
//       experimental_output: Output.object<ClassificationOutput>({
//         schema: jsonSchema<ClassificationOutput>({
//           type: "object",
//           properties: {
//             agentName: { type: "string" },
//             prompt: { type: "object" },
//             context: { type: "object" },
//             isSimple: { type: "boolean" },
//           },
//           required: ["agentName", "prompt", "context", "isSimple"],
//         }),
//       }),
//     })
//   }

//   classify(
//     options: Prompt & {
//       context: Context
//     }
//   ): ReturnType<Agent<ToolSet, ClassificationOutput>["generate"]> {
//     return this.generate(options)
//   }
// }
