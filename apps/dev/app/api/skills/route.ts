import { NextResponse } from "next/server";
import { skills } from "@syner/sdk/skills";

// Force static generation - skills only update on deploy
export const dynamic = "force-static";

export async function GET() {
  try {
    const list = await skills.list();
    return NextResponse.json(list);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
