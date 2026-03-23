"use client";

import { useState } from "react";
import useSWR from "swr";
import { type Skill, groupByCategory } from "syner/skills";
import { SkillModal } from "./skill-modal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface SkillsCatalogProps {
  skills: Skill[];
}

export function SkillsCatalog({ skills }: SkillsCatalogProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: selectedSkill, isLoading } = useSWR<Skill>(
    selectedName ? `/api/skills/${selectedName}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  const grouped = groupByCategory(skills);
  const categories = Object.keys(grouped).sort();

  function handleSkillClick(name: string) {
    setSelectedName(name);
    setModalOpen(true);
  }

  function handleModalClose(open: boolean) {
    setModalOpen(open);
    if (!open) {
      setSelectedName(null);
    }
  }

  return (
    <>
      <section className="w-full max-w-4xl px-4">
        <h2 className="mb-8 text-center text-2xl font-semibold text-black dark:text-white">
          Skills Catalog
        </h2>
        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="mb-4 text-lg font-medium text-zinc-700 dark:text-zinc-300">
                {category}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {grouped[category].map((skill: Skill) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill}
                    onClick={() => handleSkillClick(skill.name)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <SkillModal
        skill={selectedSkill ?? null}
        open={modalOpen}
        onOpenChange={handleModalClose}
        loading={isLoading}
      />
    </>
  );
}

function SkillCard({
  skill,
  onClick,
}: {
  skill: Skill;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-mono text-sm font-medium text-black dark:text-white">
          /{skill.name}
        </h4>
        {!!skill.metadata?.version && (
          <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
            v{String(skill.metadata.version)}
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
        {skill.description}
      </p>
    </button>
  );
}
