import { NextResponse } from "next/server";
import { skills } from "@syner/sdk/skills";

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const list = await skills.list();
  return list.map((skill) => ({
    slug: (skill.metadata?.slug as string) || skill.name,
  }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const skill = await skills.read(slug);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  return NextResponse.json(skill);
}
