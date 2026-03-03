export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-8 px-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white">
            syner<span className="text-zinc-400">.md</span>
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Your thoughts, amplified by AI.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
          <p>Personal knowledge management meets AI orchestration.</p>
          <p className="font-mono text-xs">Coming soon</p>
        </div>
      </main>
    </div>
  );
}
