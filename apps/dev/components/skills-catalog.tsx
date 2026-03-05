import type { Skill } from '@/lib/skills'

interface SkillsCatalogProps {
  skillsByCategory: Record<string, Skill[]>
}

const CATEGORY_ORDER = ['Orchestration', 'Dev', 'Notes', 'Auth']

export function SkillsCatalog({ skillsByCategory }: SkillsCatalogProps) {
  const categories = CATEGORY_ORDER.filter((cat) => skillsByCategory[cat])

  return (
    <section className="w-full max-w-4xl px-8 pb-20">
      <h2 className="text-2xl font-semibold mb-8 text-center text-black dark:text-white">
        Skills Catalog
      </h2>
      <div className="flex flex-col gap-10">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-4">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skillsByCategory[category].map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900"
                >
                  <p className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {skill.name}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
