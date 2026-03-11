import { source } from '@/lib/source';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const { body: MDX } = page.data as typeof page.data & { body: React.ComponentType };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{page.data.title}</h1>
      {page.data.description && (
        <p className="text-gray-500 mb-8">{page.data.description}</p>
      )}
      <div className="prose prose-neutral dark:prose-invert">
        <MDX />
      </div>
    </article>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
