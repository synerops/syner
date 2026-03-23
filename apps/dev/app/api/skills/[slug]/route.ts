import { NextResponse } from "next/server";
import { skills } from "@syner/sdk/skills";

// ISR: revalidate every hour
export const revalidate = 3600;

// Only serve pre-generated routes, never call fs at runtime
export const dynamicParams = false;

// Pre-generate routes for all skills at build time
export async function generateStaticParams() {
  const list = await skills.list();
  return list.map((skill) => ({
    slug: skill.slug,
  }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const skill = await skills.get(slug);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  return NextResponse.json(skill);
}
