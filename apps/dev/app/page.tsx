import { Hero } from "@/components/hero";
import { SkillsCatalog } from "@/components/skills-catalog";
import { getSkillsList } from "@/lib/skills";

// ISR: revalidate every hour
export const revalidate = 3600;

export default async function HomePage() {
  const skills = await getSkillsList();

  return (
    <main className="flex min-h-screen flex-col items-center bg-white pb-16 dark:bg-black">
      <Hero />
      <SkillsCatalog skills={skills} />
    </main>
  );
}
