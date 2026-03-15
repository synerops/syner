import { ImageResponse } from "next/og";
import { renderSlide } from "@syner/ui/slides/registry";
import { loadGeistSans, loadGeistMono } from "@syner/ui/fonts/satori";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import type { Slide, Style } from "@syner/ui/slides/types";

export const runtime = "nodejs";

interface RenderedSlide {
  index: number;
  url: string;
  template: string;
}

interface RenderedDeck {
  deckId: string;
  slides: RenderedSlide[];
}

export async function POST(request: Request) {
  const { slides, style } = (await request.json()) as {
    slides: Slide[];
    style?: Style;
  };

  const deckId = nanoid();

  const [sans, mono] = await Promise.all([loadGeistSans(), loadGeistMono()]);

  const rendered: RenderedDeck = { deckId, slides: [] };

  for (let i = 0; i < slides.length; i++) {
    const element = renderSlide(slides[i], style);
    const image = new ImageResponse(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist Sans", data: sans, style: "normal", weight: 400 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    });

    const buffer = await image.arrayBuffer();
    const blob = new Blob([buffer], { type: "image/png" });
    const { url } = await put(`slides/${deckId}/${i}.png`, blob, {
      access: "public",
      addRandomSuffix: false,
    });

    rendered.slides.push({
      index: i,
      url,
      template: slides[i].template,
    });
  }

  return Response.json(rendered);
}
