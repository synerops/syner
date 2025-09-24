import { Orchestrator } from "@/src/orchestrator";
import { infrastructureEngineer } from "./infrastructure-engineer";
import { deploymentEngineer } from "./deployment-engineer";
import { securityEngineer } from "./security-engineer";

const team = {
  infrastructure: infrastructureEngineer,
  deployment: deploymentEngineer,
  security: securityEngineer,
};

const request = "Deploy a new React app to the staging environment";

export async function POST(request: Request) {
  const orchestrator = new Orchestrator({
    system: "You are a DevOps Director that manages the other agents.",
  });
  const workers = await orchestrator.discoverWorkers(team);
  const result = await orchestrator.process(plan, workers);
  return Response.json({ plan, result });
}