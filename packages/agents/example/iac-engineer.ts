import { Worker } from "../src/worker";

/**
 * IAC Engineer - Worker Example
 * 
 * Scenario: Receives specific infrastructure tasks from orchestrators like:
 * "Create PostgreSQL RDS instance with proper security groups"
 * "Setup Redis ElastiCache cluster"
 * "Configure application load balancer"
 * 
 * Core workflow:
 * 1. TASK EXECUTION: Execute infrastructure tasks using Terraform/CloudFormation
 * 2. RESOURCE MANAGEMENT: Manage cloud resources efficiently
 * 3. REPORTING: Report progress and results back to orchestrator
 */

const iacEngineer = new Worker({
  system: `You are an Infrastructure as Code (IAC) Engineer specialized in AWS cloud infrastructure.

Your expertise includes:
- Terraform and CloudFormation templates
- AWS services: EC2, RDS, ElastiCache, ALB, VPC, Security Groups
- Infrastructure security best practices
- Cost optimization strategies
- Monitoring and observability setup

Your responsibilities:
1. EXECUTE specific infrastructure tasks assigned by orchestrators
2. VALIDATE input parameters and configurations before execution
3. HANDLE errors gracefully with proper retry mechanisms
4. OPTIMIZE resource usage for cost and performance
5. REPORT detailed progress and results

Always validate task parameters first, then execute with proper error handling.
Provide detailed technical feedback including:
- Resources created/modified
- Configuration details
- Security considerations
- Cost implications
- Next steps or dependencies`
});

// Example usage
async function handleInfrastructureTask() {
  console.log("⚙️ IAC Engineer: Handling infrastructure task...\n");
  
  const task = {
    id: "task-001",
    name: "Create PostgreSQL Database",
    description: "Setup PostgreSQL RDS instance for user-authentication microservice",
    parameters: {
      environment: "production",
      instanceClass: "db.t3.micro",
      allocatedStorage: 20,
      engine: "postgres",
      engineVersion: "15.4",
      multiAZ: true,
      backupRetention: 7
    }
  };
  
  try {
    const result = await iacEngineer.generate({
      messages: [
        {
          role: "user",
          content: `I need you to execute this infrastructure task:

Task: ${task.name}
Description: ${task.description}
Parameters: ${JSON.stringify(task.parameters, null, 2)}

Please validate the parameters first, then execute the task with proper error handling.`
        }
      ]
    });
    
    console.log("🔧 IAC Engineer Response:");
    console.log(result.text);
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Example of handling multiple related tasks
async function handleMultipleInfraTasks() {
  console.log("⚙️ IAC Engineer: Handling multiple infrastructure tasks...\n");
  
  const tasks = [
    "Create VPC with public and private subnets",
    "Setup PostgreSQL RDS instance in private subnet",
    "Create Redis ElastiCache cluster",
    "Configure Application Load Balancer",
    "Setup CloudWatch monitoring and alerts"
  ];
  
  try {
    const result = await iacEngineer.generate({
      messages: [
        {
          role: "user",
          content: `I have multiple related infrastructure tasks for a microservice deployment:

${tasks.map((task, index) => `${index + 1}. ${task}`).join('\n')}

Please analyze these tasks, identify dependencies, and provide an execution plan with detailed steps for each task.`
        }
      ]
    });
    
    console.log("🔧 IAC Engineer Multi-Task Response:");
    console.log(result.text);
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await handleInfrastructureTask();
  console.log("\n" + "=".repeat(50) + "\n");
  await handleMultipleInfraTasks();
}

export { iacEngineer };
