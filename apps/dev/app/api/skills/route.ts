import { NextResponse } from "next/server";
import { getSkillsList } from "syner/skills";
import path from "path";

// ISR: revalidate every hour
export const revalidate = 3600;

// Project root is two levels up from apps/dev
function getProjectRoot(): string {
  return path.resolve(process.cwd(), "../..");
}

export async function GET() {
  try {
    const projectRoot = getProjectRoot();
    const skills = await getSkillsList(projectRoot);
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
