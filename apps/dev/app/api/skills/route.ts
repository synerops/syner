import { NextResponse } from "next/server";
import { getSkillsList } from "@/lib/skills";

// ISR: revalidate every hour
export const revalidate = 3600;

export async function GET() {
  try {
    const skills = await getSkillsList();
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
