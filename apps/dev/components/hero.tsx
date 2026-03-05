export function Hero() {
  return (
    <section className="flex flex-col items-center gap-4 text-center py-20 px-8">
      <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white">
        syner<span className="text-zinc-400">.dev</span>
      </h1>
      <p className="text-xl text-zinc-500 dark:text-zinc-400">
        Agent skills for Claude Code
      </p>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Personal context through markdown notes.
      </p>
      <a
        href="https://github.com/synerops/syner"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
      >
        View on GitHub
      </a>
    </section>
  )
}
