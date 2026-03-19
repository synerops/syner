import { source } from '@/lib/source'
import { notFound } from 'next/navigation'

export default async function DeckPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = source.getPage([slug])
  if (!page) notFound()

  const { body: MDX } = page.data as typeof page.data & { body: React.ComponentType }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{page.data.title}</h1>
      {page.data.description && (
        <p className="mt-2 text-zinc-500">{page.data.description}</p>
      )}
      <div className="prose mt-8 dark:prose-invert">
        <MDX />
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: page.slugs[0],
  }))
}
