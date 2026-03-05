import { Hero } from '@/components/hero'
import { SkillsCatalog } from '@/components/skills-catalog'
import { getSkillsByCategory } from '@/lib/skills'

export default function Home() {
  const skillsByCategory = getSkillsByCategory()

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full flex-col items-center">
        <Hero />
        <SkillsCatalog skillsByCategory={skillsByCategory} />
        <section className="w-full max-w-4xl px-8 pb-20">
          <h2 className="text-2xl font-semibold mb-6 text-center text-black dark:text-white">
            Install
          </h2>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono">
              <code>{`git clone https://github.com/synerops/syner
cp -r syner/.claude/skills/[skill-name] your-project/.claude/skills/`}</code>
            </pre>
          </div>
        </section>
      </main>
    </div>
  )
}
