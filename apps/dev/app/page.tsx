import { Hero } from "@/components/hero";
import { SkillsCatalog } from "@/components/skills-catalog";
import { getSkillsList } from "@syner/sdk/skills";
import path from "path";

// Force static generation - skills only update on deploy
// (Vercel serverless doesn't have monorepo filesystem at runtime)
export const dynamic = "force-static";

// Project root is two levels up from apps/dev
function getProjectRoot(): string {
  return path.resolve(process.cwd(), "../..");
}

export default async function HomePage() {
  const projectRoot = getProjectRoot();
  const skills = await getSkillsList(projectRoot);

  return (
    <main className="flex min-h-screen flex-col items-center bg-white pb-16 dark:bg-black">
      <Hero />
      <SkillsCatalog skills={skills} />
    </main>
  );
}
