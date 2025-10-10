/**
 * Syner OS
 * Agentic Operating System
 */

// Export namespace objects
import * as system from "./system";
import * as context from "./context";
import * as actions from "./actions";
import * as checks from "./checks";
import * as agents from "./agents";
import * as runtime from "./runtime";

export { system, context, actions, checks, agents, runtime };

// Re-export types from system
export * from "./system/types";

// Default export for convenience
const syner = {
  system,
  context,
  actions,
  checks,
  agents,
  runtime,
};

export default syner;
