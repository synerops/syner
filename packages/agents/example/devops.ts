import { Orchestrator } from "@/src/orchestrator"
import { PlanBuilder } from "@/src/plan"
import { CommonSchemas } from "@/src/schemas"

const config = {
  system: `You are a DevOps Director that manages the other agents.`
}

export async function POST(request?: Request) {
  const orchestrator = new Orchestrator(config)
  
  // Create tasks for the deployment
  const databaseTask = {
    id: "task-1",
    name: "deploy-database",
    goal: "Deploy PostgreSQL database for the React app",
    capabilities: [{
      name: "infrastructure",
      description: "Infrastructure management capability",
      tools: {},
      input: {},
      output: {}
    }],
    dependencies: [],
    status: "pending" as const,
    input: { 
      environment: "production",
      instanceType: "db.t3.micro",
      storage: 20
    },
    output: {}
  }
  
  const appTask = {
    id: "task-2", 
    name: "deploy-app",
    goal: "Deploy React application to production",
    capabilities: [{
      name: "deployment",
      description: "Application deployment capability",
      tools: {},
      input: {},
      output: {}
    }],
    dependencies: [databaseTask],
    status: "pending" as const,
    input: { 
      environment: "production",
      buildCommand: "npm run build",
      port: 3000
    },
    output: {}
  }
  
  // Create plan with tasks and dependencies
  const plan = new PlanBuilder("deploy-react-app", "Deploy React App to Production", "Complete deployment of React application with database")
    .addTask(databaseTask)
    .addTask(appTask)
    .setPriority("high")
    .setEnvironment("production")
    .setEstimatedDuration("30 minutes")
    .build()
  
  // Execute plan - orchestrator will decompose into tasks and delegate to workers
  const result = await orchestrator.plan(plan)
  return Response.json({ plan, result })
}

POST()