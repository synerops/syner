import { Orchestrator } from "@/src/orchestrator"
import { PlanBuilder } from "@/src/plan"
import { CommonSchemas } from "@/tools/types"

const config = {
  system: `You are a DevOps Director that manages the other agents.`
}

export async function POST(request?: Request) {
  const orchestrator = new Orchestrator(config)
  
  // Create tasks for the deployment
  const databaseTask = {
    id: "task-1",
    name: "deploy-database",
    description: "Deploy PostgreSQL database for the React app",
    capability: "infrastructure",
    parameters: { 
      environment: "production",
      instanceType: "db.t3.micro",
      storage: 20
    },
    status: "pending" as const
  }
  
  const appTask = {
    id: "task-2", 
    name: "deploy-app",
    description: "Deploy React application to production",
    capability: "deployment",
    parameters: { 
      environment: "production",
      buildCommand: "npm run build",
      port: 3000
    },
    status: "pending" as const
  }
  
  // Create plan with tasks and dependencies
  const plan = new PlanBuilder("deploy-react-app", "Deploy React App to Production", "Complete deployment of React application with database")
    .addTask(databaseTask)
    .addTask(appTask)
    .addDependency("task-1", "task-2") // App depends on database
    .setPriority("high")
    .setEnvironment("production")
    .setEstimatedDuration("30 minutes")
    .build()
  
  // Execute plan - orchestrator will decompose into tasks and delegate to workers
  const result = await orchestrator.plan(plan)
  return Response.json({ plan, result })
}

POST()