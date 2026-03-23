'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-4 px-8 text-center">
        <h1 className="text-2xl font-bold text-black dark:text-white">Something went wrong</h1>
        <p className="text-sm text-zinc-500">{error.digest ?? error.message}</p>
        <button
          onClick={reset}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
        >
          Try again
        </button>
      </main>
    </div>
  )
}
