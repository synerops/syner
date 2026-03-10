import { Hero } from "@/components/hero";
import { SkillsCatalog } from "@/components/skills-catalog";
import { getSkillsList } from "syner/skills";
import path from "path";

// ISR: revalidate every hour
export const revalidate = 3600;

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
