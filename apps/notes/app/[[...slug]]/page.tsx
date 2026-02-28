import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { getContentTree, loadContent } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

function Breadcrumb({ slug }: { slug?: string[] }) {
  if (!slug || slug.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <Link href="/" className="text-muted-foreground hover:text-foreground">
        notes
      </Link>
      {slug.map((segment, i) => (
        <span key={slug.slice(0, i + 1).join("/")}>
          <span className="mx-2 text-muted-foreground/60">/</span>
          {i === slug.length - 1 ? (
            <span className="text-foreground">{segment}</span>
          ) : (
            <Link
              href={`/${slug.slice(0, i + 1).join("/")}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {segment}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

export async function generateStaticParams() {
  const paths = getContentTree();
  return [
    { slug: undefined }, // root
    ...paths.map((path) => ({ slug: path.split("/") })),
  ];
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const result = loadContent(slug);

  if (!result) {
    notFound();
  }

  const basePath = slug ? `/${slug.join("/")}` : "";

  if (result.type === "list") {
    return (
      <main className="mx-auto max-w-3xl p-5">
        <Breadcrumb slug={slug} />
        <h1 className="text-2xl font-bold mb-4">{slug ? slug[slug.length - 1] : "Notes"}</h1>
        <ul className="space-y-2">
          {result.items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`${basePath}/${item.slug}`}
                className="text-foreground hover:text-muted-foreground underline underline-offset-2"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-5">
      <Breadcrumb slug={slug} />
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown>{result.content}</ReactMarkdown>
      </article>
    </main>
  );
}
