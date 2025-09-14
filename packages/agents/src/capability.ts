// In general usage, capability is defined as the ability to do something. 
// This "ability" is not limited to what is innate but can come from external tools, acquired knowledge, or processes.
// Example: The company has the capability to produce 10,000 units per day.
// Here, the "capability" depends on machinery(tools), workers, and know - how.

import type { Tool, JSONValue } from "ai"

export type Capability = {
  name: string
  description: string
  tools: Tool[]
  input: JSONValue
  output: JSONValue
}