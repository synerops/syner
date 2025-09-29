import { greetingWorker } from "./worker";

/**
 * Hello World Example
 * 
 * This example demonstrates the most basic usage of the @syner/agents framework:
 * - Create a worker with a specific capability
 * - Execute a simple task
 * - Get a structured result
 */

async function runHelloWorldExample() {
  console.log(JSON.stringify({ level: "info", message: "Starting Hello World Example" }));
  
  try {
    // Define a simple greeting task
    const greetingTask = {
      id: "greet-user-001",
      title: "Greet the user",
      goal: "Provide a warm welcome greeting to the user",
      requiredCapabilities: ["greeting"],
      input: {
        name: "Developer",
        context: "welcome",
        language: "en"
      },
      status: "pending" as const
    };

    console.log(JSON.stringify({ 
      level: "info", 
      message: "Task created", 
      taskId: greetingTask.id,
      goal: greetingTask.goal,
      input: greetingTask.input
    }));

    // Execute the task using the greeting worker
    console.log(JSON.stringify({ level: "info", message: "Executing task with greeting worker" }));
    const result = await greetingWorker.executeTask(greetingTask);

    console.log(JSON.stringify({ level: "success", message: "Task completed successfully", result }));

  } catch (error: unknown) {
    console.error(JSON.stringify({ level: "error", message: "Task execution failed", error: error instanceof Error ? error.message : String(error) }));
  }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runHelloWorldExample();
}

export { runHelloWorldExample };
