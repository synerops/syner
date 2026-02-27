import { query } from "@anthropic-ai/claude-agent-sdk";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const message of query({
        prompt,
        options: {
          cwd: process.cwd(),
          settingSources: ["project"],
          allowedTools: [
            "Skill",
            "Read",
            "Write",
            "Bash",
            "Glob",
            "Grep",
            "WebSearch",
            "WebFetch"
          ],
        }
      })) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    }
  });
}
