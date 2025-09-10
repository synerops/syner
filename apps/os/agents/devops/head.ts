import type { Agent, Capability, Task, Specialist } from "@syner/agents"

export const capabilities = {
  devops: {
    description: "DevOps capabilities",
  }
}

interface HeadOfDepartment {
  name: string
  capabilities: Capability[]
}

export class HeadOfDevOps extends Agent implements HeadOfDepartment {
  constructor() {
    super()
  }

  public async execute(task: Task): Promise<void> {
    const specialist = this.findSpecialist(task.capabilities)
    return specialist.executeWithTools(task, this.department.getTools())
  }
  
  private findSpecialist(capabilities: Capability[]): Specialist {
  }
}