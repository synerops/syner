import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const { body: MDX } = page.data as typeof page.data & {
    body: React.ComponentType<{ components?: typeof defaultMdxComponents }>;
  };

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-12">
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description ? (
        <DocsDescription>{page.data.description}</DocsDescription>
      ) : null}
      <DocsBody>
        <MDX components={defaultMdxComponents} />
      </DocsBody>
    </article>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
