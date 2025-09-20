import { Supervisor } from "../src/supervisor";

/**
 * Director DevOps - Supervisor Example
 * 
 * Scenario: Receives high-level requests like "Deploy microservice X to production"
 * and orchestrates the entire process through planning, delegation, and monitoring.
 * 
 * Core workflow:
 * 1. PLANNING: Analyze request and create structured action plan
 * 2. ORCHESTRATION: Delegate tasks to specialized engineers (IAC, Security, etc.)
 * 3. MONITORING: Track progress and coordinate dependencies
 */

const directorDevOps = new Supervisor({
  system: `You are a Director of DevOps responsible for overseeing infrastructure deployments and operations.

Your primary responsibilities:
1. ANALYZE incoming requests to understand requirements and constraints
2. CREATE comprehensive action plans breaking down complex deployments into specific tasks
3. DELEGATE tasks to specialized engineers (IAC Engineers, Security Engineers, etc.)
4. COORDINATE dependencies between tasks and teams
5. MONITOR overall progress and ensure successful delivery

Always start with PLANNING before any orchestration. Use your planning capability to:
- Analyze the request thoroughly
- Identify all required steps and dependencies
- Create a structured action plan
- Estimate timelines and resource requirements

Then use orchestration to delegate specific tasks to the appropriate specialists.`
});

// Example usage
async function handleDeploymentRequest() {
  console.log("🎯 Director DevOps: Handling deployment request...\n");
  
  const request = "Deploy the new user-authentication microservice to production. It needs a PostgreSQL database, Redis cache, and proper monitoring setup.";
  
  try {
    // This will trigger the planning capability first
    const result = await directorDevOps.generate({
      messages: [
        {
          role: "user",
          content: `I need you to handle this deployment request: ${request}
          
Please start by analyzing the request and creating a comprehensive action plan.`
        }
      ]
    });
    
    console.log("📋 Director DevOps Response:");
    console.log(result.text);
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  handleDeploymentRequest();
}

export { directorDevOps };
