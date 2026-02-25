import { getContentTree, loadContent } from "@/lib/content";

export async function generateStaticParams() {
  const paths = getContentTree();
  return [
    { slug: undefined },
    ...paths.map((path) => ({ slug: path.split("/") })),
  ];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const result = loadContent(slug);

  if (!result || result.type !== "file") {
    return new Response("Not found", { status: 404 });
  }

  return new Response(result.content, {
    headers: { "Content-Type": "text/markdown" },
  });
}
