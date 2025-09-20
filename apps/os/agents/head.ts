import { workflowPlanner } from "@/tools/workflow-planner"
import { taskDelegator } from "@/tools/task-delegator"
import { resultAggregator } from "@/tools/result-aggregator"

import { Supervisor } from "@syner/agents"

export const capabilities = {
  planning: {
    description: "Analyze the request, break it down into subtasks and define an action plan",
    tools: [
      workflowPlanner
    ]
  },
  delegation: {
    description: "Delegate the subtasks to the appropriate agents, ensuring that each one works within its scope",
    tools: [
      taskDelegator
    ]
  },
  coordination: {
    description: "Keep the flow going, ensure that the partial results return, validate them and integrate them",
    tools: [
      resultAggregator
  },
}

interface DepartmentRegistry {
  discoverDepartments(): Promise<Department[]>
  registerHead(department: string, head: HeadAgent): Promise<void>
  getAvailableCapabilities(department: string): Promise<Capability[]>
}

export class Orchestrator extends Supervisor implements DepartmentRegistry {
  constructor() {
    super()
  }

  async handleUserRequest(request: UserRequest): Promise<void> {
    const plan = await this.createPlan(request)
    
    const results = await Promise.all(
      plan.task.map(task => this.delegateTask(task))
    )

    return this.aggregateResults(results)
  }

  async delegateTask(task: Task): Promise<void> {
    const capabilities = await this.registry.getAvailableCapabilities(task.department)
    const suitableDepartment = this.findBestDepartment(capabilities, task.capabilities)
    return this.delegateTaskToHeadOfDepartment(suitableDepartment, task)
  }
}