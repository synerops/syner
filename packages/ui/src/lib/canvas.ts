/**
 * Color measurement that goes through the browser's own painter.
 *
 * `getComputedStyle` hands back whatever notation the stylesheet used —
 * `oklch()`, `lab()`, `color(srgb ...)`, `rgba()` with alpha. Parsing those by
 * hand means reimplementing color conversion and alpha compositing, and getting
 * either one slightly wrong makes every number downstream wrong.
 *
 * Painting onto a 1x1 canvas and reading the pixel back skips all of it: the
 * browser converts and composites exactly the way it does on screen, and what
 * comes out is the sRGB the eye receives.
 */

const TRANSPARENT = new Set(["transparent", "rgba(0, 0, 0, 0)"])

export type RGB = [number, number, number]

export type Pair = {
  /** Composited foreground, as painted. */
  fg: string
  /** Composited background behind it, as painted. */
  bg: string
  /** WCAG 2.1 contrast ratio, two decimals. */
  ratio: number
  /** 4.5 for body text, 3 for large text (>=24px, or >=18.66px at weight 700+). */
  threshold: number
  passes: boolean
  fontPx: number
  weight: number
  /** How many elements on the page render this exact pair. */
  count: number
  /** One element that produced it, for `document.querySelector`. */
  sample: string
  text: string
}

let ctx: CanvasRenderingContext2D | null = null

function context(): CanvasRenderingContext2D {
  if (ctx) return ctx
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const next = canvas.getContext("2d", { willReadFrequently: true })
  if (!next) throw new Error("Canvas 2D context unavailable")
  ctx = next
  return next
}

/**
 * Paint `layers` bottom-up over white and read the resulting pixel. Pass the
 * full stack — page, then each ancestor that paints a background, then the
 * color itself — so translucent layers composite the way they do on screen.
 */
export function paint(layers: string[]): RGB {
  const c = context()
  c.clearRect(0, 0, 1, 1)
  c.fillStyle = "#ffffff"
  c.fillRect(0, 0, 1, 1)
  for (const layer of layers) {
    c.fillStyle = layer
    c.fillRect(0, 0, 1, 1)
  }
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data
  return [r ?? 0, g ?? 0, b ?? 0]
}

export function hex(rgb: RGB): string {
  return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`
}

/** Resolve any CSS color to the sRGB hex it actually paints as. */
export function resolve(color: string, over: string[] = []): string {
  return hex(paint([...over, color]))
}

function luminance([r, g, b]: RGB): number {
  const channel = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** WCAG 2.1 contrast ratio between two painted colors. */
export function contrast(foreground: RGB | string, background: RGB | string): number {
  const fg = typeof foreground === "string" ? paint([foreground]) : foreground
  const bg = typeof background === "string" ? paint([background]) : background
  const a = luminance(fg)
  const b = luminance(bg)
  const hi = Math.max(a, b)
  const lo = Math.min(a, b)
  return Number(((hi + 0.05) / (lo + 0.05)).toFixed(2))
}

/** Every painted background from the root down to `el`, in paint order. */
function backgroundStack(el: Element): string[] {
  const layers: string[] = []
  let node: Element | null = el
  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor
    if (bg && !TRANSPARENT.has(bg)) layers.unshift(bg)
    node = node.parentElement
  }
  const root = getComputedStyle(document.documentElement).backgroundColor
  layers.unshift(TRANSPARENT.has(root) ? "#ffffff" : root)
  return layers
}

function selectorFor(el: Element): string {
  const slot = el.getAttribute("data-slot")
  if (slot) return `[data-slot="${slot}"]`
  const id = el.id
  if (id) return `#${id}`
  const tag = el.tagName.toLowerCase()
  const cls = (el.getAttribute("class") ?? "").trim().split(/\s+/).filter(Boolean)[0]
  return cls ? `${tag}.${CSS.escape(cls)}` : tag
}

/** Elements that render their own text, not just wrap children that do. */
function textElements(root: ParentNode): Element[] {
  return [...root.querySelectorAll<HTMLElement>("*")].filter((el) => {
    if (!el.offsetParent && getComputedStyle(el).position !== "fixed") return false
    return [...el.childNodes].some(
      (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0
    )
  })
}

/**
 * Measure every text/background pair on the page.
 *
 * Rows are deduped by the pair itself — color, size and weight — because that
 * is what passes or fails. A page with two hundred muted labels is one finding,
 * not two hundred. Worst ratio first.
 */
export function audit(root: ParentNode = document.body): Pair[] {
  const byPair = new Map<string, Pair>()

  for (const el of textElements(root)) {
    const style = getComputedStyle(el)
    const stack = backgroundStack(el)
    const bg = paint(stack)
    const fg = paint([...stack, style.color])
    const fontPx = Number.parseFloat(style.fontSize)
    const weight = Number.parseInt(style.fontWeight, 10) || 400
    const large = fontPx >= 24 || (fontPx >= 18.66 && weight >= 700)
    const threshold = large ? 3 : 4.5
    const ratio = contrast(fg, bg)

    const key = `${hex(fg)}|${hex(bg)}|${fontPx}|${weight}`
    const seen = byPair.get(key)
    if (seen) {
      seen.count += 1
      continue
    }
    byPair.set(key, {
      fg: hex(fg),
      bg: hex(bg),
      ratio,
      threshold,
      passes: ratio >= threshold,
      fontPx,
      weight,
      count: 1,
      sample: selectorFor(el),
      text: (el.textContent ?? "").trim().slice(0, 40),
    })
  }

  return [...byPair.values()].sort((a, b) => a.ratio - b.ratio)
}

export type Report = {
  theme: "light" | "dark"
  pairs: Pair[]
  failing: Pair[]
}

export function report(root?: ParentNode): Report {
  const pairs = audit(root)
  return {
    theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
    pairs,
    failing: pairs.filter((p) => !p.passes),
  }
}
