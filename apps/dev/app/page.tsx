import { Hero } from "@/components/hero";
import { SkillsCatalog } from "@/components/skills-catalog";
import { skills } from "syner/registry";

// Force static generation - skills only update on deploy
export const dynamic = "force-static";

export default async function HomePage() {
  const list = await skills.list();

  return (
    <main className="flex min-h-screen flex-col items-center bg-white pb-16 dark:bg-black">
      <Hero />
      <SkillsCatalog skills={list} />
    </main>
  );
}
