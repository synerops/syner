import { getSupervisorTools } from "./supervisor";
import { getWorkerTools } from "./worker";
import { getSharedTools } from "./shared";
import type { Tool } from "ai";

// TODO: Use ToolRegistry instead of Tool[]
// import { ToolRegistry } from "./types";

// Registry of all tools
export const toolRegistry: Record<string, Tool[]> = {
  supervisor: getSupervisorTools(),
  worker: getWorkerTools(),
  shared: getSharedTools(),
};
