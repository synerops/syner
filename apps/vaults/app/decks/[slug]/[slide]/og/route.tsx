import { ImageResponse } from 'next/og'
import { renderSlide } from '@syner/ui/slides/registry'
import type { Slide, Style } from '@syner/ui/slides/types'

const defaultDeckStyle: Style = {
  backgroundColor: '#09090b',
  color: '#fafafa',
  fontFamily: 'Geist',
  fontSize: 32,
  padding: 60,
  gap: 16,
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; slide: string }> }
) {
  const { slug, slide: slideIndex } = await params

  // TODO: Load deck data from storage (KV/Blob) using slug
  // For now, return a placeholder slide
  const slideData: Slide = {
    template: 'title',
    heading: slug.replace(/-/g, ' '),
    subtitle: `Slide ${slideIndex}`,
  }

  try {
    const element = renderSlide(slideData, defaultDeckStyle)

    return new ImageResponse(element, {
      width: 1200,
      height: 630,
    })
  } catch {
    // Fallback if template not registered
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: defaultDeckStyle.backgroundColor,
            color: defaultDeckStyle.color,
            fontFamily: defaultDeckStyle.fontFamily,
            padding: defaultDeckStyle.padding,
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 700 }}>
            {slug.replace(/-/g, ' ')}
          </div>
          <div style={{ fontSize: 24, opacity: 0.7, marginTop: 16 }}>
            Slide {slideIndex}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}
