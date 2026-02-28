import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface ChatRequest {
  selection: string;
  message: string;
}

const SYSTEM_PROMPT = `You are an assistant that helps users edit their writing. When given selected text and a user instruction, you provide the edited version.

Rules:
- Only output the edited text, nothing else
- Preserve the tone and style unless explicitly asked to change it
- Keep formatting (markdown) intact
- Be concise and direct`;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { selection, message } = body;

    if (!selection?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Missing selection or message" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Selected text:
"""
${selection}
"""

Instruction: ${message}

Provide only the edited text, no explanations.`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response type" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      action: "replace",
      content: content.text,
      originalSelection: selection,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
