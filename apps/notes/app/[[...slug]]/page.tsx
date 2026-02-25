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
    <nav aria-label="Breadcrumb" style={{ marginBottom: 16, fontSize: 14 }}>
      <Link href="/" style={{ color: "#666" }}>
        notes
      </Link>
      {slug.map((segment, i) => (
        <span key={i}>
          <span style={{ margin: "0 8px", color: "#999" }}>/</span>
          {i === slug.length - 1 ? (
            <span>{segment}</span>
          ) : (
            <Link href={`/${slug.slice(0, i + 1).join("/")}`} style={{ color: "#666" }}>
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
      <main style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
        <Breadcrumb slug={slug} />
        <h1>{slug ? slug[slug.length - 1] : "Notes"}</h1>
        <ul>
          {result.items.map((item) => (
            <li key={item.slug}>
              <Link href={`${basePath}/${item.slug}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <Breadcrumb slug={slug} />
      <article>
        <ReactMarkdown>{result.content}</ReactMarkdown>
      </article>
    </main>
  );
}
