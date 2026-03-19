import { NextResponse } from "next/server";
import { getSkillBySlug, getSkillsList } from "@syner/sdk/skills";
import path from "path";

// ISR: revalidate every hour
export const revalidate = 3600;

// Only serve pre-generated routes, never call fs at runtime
export const dynamicParams = false;

// Project root is two levels up from apps/dev
function getProjectRoot(): string {
  return path.resolve(process.cwd(), "../..");
}

// Pre-generate routes for all skills at build time
export async function generateStaticParams() {
  const projectRoot = getProjectRoot();
  const skills = await getSkillsList(projectRoot);
  return skills.map((skill) => ({
    slug: skill.name,
  }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const projectRoot = getProjectRoot();
  const skill = await getSkillBySlug(projectRoot, slug);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  return NextResponse.json(skill);
}
