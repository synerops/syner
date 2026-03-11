import { NextResponse } from "next/server";
import { getSkillsList } from "syner/skills";
import path from "path";

// Force static generation - skills only update on deploy
// (Vercel serverless doesn't have monorepo filesystem at runtime)
export const dynamic = "force-static";

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
