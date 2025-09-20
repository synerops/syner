import type { Capability } from "@syner/agents/src/capabilities/capability.js"

export type Department = {
  name: string
  capabilities: Capability[]
}

interface DepartmentRegistry {
  discoverDepartments(): Promise<Department[]>
  registerHead(department: string, head: HeadAgent): Promise<void>
  getAvailableCapabilities(department: string): Promise<Capability[]>
}