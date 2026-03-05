export function InstallInstructions() {
  return (
    <section className="w-full max-w-2xl px-4 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold text-black dark:text-white">
        Installation
      </h2>
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Clone the repository and copy the skills you need:
        </p>
        <pre className="overflow-x-auto rounded bg-black p-4 text-sm text-green-400">
          <code>{`git clone https://github.com/synerops/syner
cp -r syner/.claude/skills/[skill-name] your-project/.claude/skills/`}</code>
        </pre>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
          Skills are standalone markdown files. Just copy and use.
        </p>
      </div>
    </section>
  );
}
