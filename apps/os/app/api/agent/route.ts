import { routerAgent } from "@/agents/router";
import { marketingSupervisor } from "@/agents/marketing/supervisor";
import { NoObjectGeneratedError, ToolSet } from "ai";
import { Agent } from "@/lib/agents";

// Map of available supervisors
const supervisors = {
  marketing: marketingSupervisor,
  // Add more supervisors here as they are created
};

// a simple utility function to load the supervisor agent and returns the agent instance
function loadSupervisor(name: string): any {
  console.log(`Loading supervisor: ${name}`);
  const supervisor = supervisors[name as keyof typeof supervisors];
  if (!supervisor) {
    throw new Error(`Supervisor "${name}" not found`);
  }
  return supervisor;
}

async function generateResult(
  supervisorAgent: Agent<ToolSet, any, any>,
  task: string,
) {
  // invoke the supervisor's generate method with the task as prompt
  console.log(
    `Generating result for task: ${task} with supervisor: ${supervisorAgent.name}`,
  );

  const { experimental_output: output } = await supervisorAgent.generate({
    prompt: task,
  });

  return output;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json({ status: "No prompt provided" }, { status: 400 });
    }

    const { experimental_output: output } = await routerAgent.generate({
      prompt,
    });

    if (!output.needsRouting) {
      return Response.json({ message: output.directResponse });
    }

    // Type safety check: routes must exist when routing is needed
    if (!output.routes || output.routes.length === 0) {
      return Response.json(
        { status: "Routing requested but no routes provided" },
        { status: 500 },
      );
    }

    // sequentially call the agents
    // TODO: replace this with a propler workflow pattern
    const results = await Promise.all(
      output.routes.map(async (route) => {
        const supervisorAgent = loadSupervisor(route.supervisor);
        const result = await generateResult(supervisorAgent, route.taskToPlan);
        console.log(result);
        return [
          {
            supervisor: route.supervisor,
            reasonOfRouting: "reasonOfRouting",
            taskToPlan: route.taskToPlan,
          },
        ];
      }),
    );

    console.log(results);

    return Response.json(output);
  } catch (error) {
    console.error(error);

    if (NoObjectGeneratedError.isInstance(error)) {
      return Response.json(
        { status: "Unable to generate output" },
        { status: 500 },
      );
    }

    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
