import type { Deck, Slide, Style } from '@syner/ui/slides/types'
import matter from 'gray-matter'

export interface DeckSource {
  slug: string
  content: string
}

export function parseDeck(source: DeckSource): Deck {
  const { data: frontmatter, content } = matter(source.content)

  // Split content by slide separators (---)
  const slideBlocks = content
    .split(/\n---\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  const slides: Slide[] = slideBlocks.map((block) => {
    const { data: slideMeta, content: slideContent } = matter(block)
    return {
      template: slideMeta.template || 'custom',
      heading: slideMeta.heading || slideMeta.title,
      subtitle: slideMeta.subtitle,
      content: slideContent.trim() || slideMeta.content,
      style: slideMeta.style as Partial<Style> | undefined,
    }
  })

  return {
    id: source.slug,
    title: frontmatter.title || source.slug,
    slides,
    style: frontmatter.style as Style | undefined,
  }
}
