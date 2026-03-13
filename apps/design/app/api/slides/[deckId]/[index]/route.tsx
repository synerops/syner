import { head } from "@vercel/blob";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ deckId: string; index: string }> }
) {
  const { deckId, index } = await params;
  const blobPath = `slides/${deckId}/${index}.png`;

  const metadata = await head(blobPath);
  if (!metadata) {
    return new Response("Not found", { status: 404 });
  }

  const response = await fetch(metadata.url);
  const image = await response.arrayBuffer();

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
