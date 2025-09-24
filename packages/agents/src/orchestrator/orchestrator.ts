// In general usage, an orchestrator is defined as an entity that coordinates and manages complex workflows across multiple agents.
// This "coordination" involves planning, delegating, and monitoring tasks to achieve specific outcomes.
// Example: The orchestrator decomposes a request into tasks, assigns them to the appropriate workers, and coordinates dependencies.
// Here, the "orchestrator" depends on planning/orchestration capabilities, the organizational structure (departments and workers),
// and the system policies that govern how work is planned, assigned, and reported.

import { Experimental_Agent as Agent } from "ai";
import { getOrchestratorTools, type OrchestratorTools } from "@/tools";
import type { Plan } from "../plan/types";
import { planningCapability } from "@/tools/supervisor/planning";

export class Orchestrator extends Agent<OrchestratorTools> {
  private planning: PlanningCapability;
  private orchestration: OrchestrationCapability;
  // private monitoring: MonitoringCapability;

  constructor(config: OrchestratorConfig) {
    super();
    this.planning = new PlanningCapability();
    this.orchestration = new OrchestrationCapability();
    // this.monitoring = new MonitoringCapability();
  }

  async plan(request: string): Promise<Plan> {
    throw new Error("Not implemented");
  }

  async coordinate(plan: Plan): Promise<Workflow> {
    throw new Error("Not implemented");
  }

  // plan and coordinate
  async process(request: string): Promise<Workflow> {
    throw new Error("Not implemented");
  }

  // async monitor(plan: Plan): Promise<string> {
  //   return this.monitoring.monitor(plan);
  // }
}
