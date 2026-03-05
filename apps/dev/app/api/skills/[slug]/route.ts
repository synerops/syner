import { NextResponse } from "next/server";
import { getSkillBySlug, getSkillsList } from "@/lib/skills";

// ISR: revalidate every hour
export const revalidate = 3600;

// Pre-generate routes for all skills at build time
export async function generateStaticParams() {
  const skills = await getSkillsList();
  return skills.map((skill) => ({
    slug: skill.slug,
  }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  return NextResponse.json(skill);
}
