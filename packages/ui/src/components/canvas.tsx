"use client"

import * as React from "react"

import { audit, contrast, paint, report, resolve, type Pair } from "@syner/ui/lib/canvas"
import { cn } from "@syner/ui/lib/utils"

declare global {
  interface Window {
    canvas?: {
      audit: typeof audit
      contrast: typeof contrast
      paint: typeof paint
      report: typeof report
      resolve: typeof resolve
    }
  }
}

/**
 * Live contrast readout for the page it is mounted on.
 *
 * Two ways in. Mount `<Canvas />` for the panel, or skip the UI entirely and
 * call `window.canvas.report()` from the console or a driver — same numbers,
 * no rendering. The console path is why this registers itself on mount.
 *
 * Measurement lives in `@syner/ui/lib/canvas`; this file is only the surface.
 */
export function Canvas({
  className,
  open: openProp,
  ...props
}: React.ComponentProps<"aside"> & { open?: boolean }) {
  const [open, setOpen] = React.useState(openProp ?? false)
  const [pairs, setPairs] = React.useState<Pair[]>([])
  const [showAll, setShowAll] = React.useState(false)

  React.useEffect(() => {
    window.canvas = { audit, contrast, paint, report, resolve }
    return () => {
      delete window.canvas
    }
  }, [])

  // Re-measure when the panel opens and whenever the theme class flips.
  React.useEffect(() => {
    if (!open) return
    const run = () => setPairs(audit())
    run()
    const observer = new MutationObserver(run)
    observer.observe(document.documentElement, {
      attributeFilter: ["class", "style"],
    })
    return () => observer.disconnect()
  }, [open])

  const failing = pairs.filter((p) => !p.passes)
  const rows = showAll ? pairs : failing

  if (!open) {
    return (
      <button
        className={cn(
          // Bottom-right on desktop; on small screens that corner belongs to
          // the app's own thumb-zone controls, so it moves out of the way.
          "fixed right-3 top-3 z-50 rounded-lg border bg-card px-2.5 py-1.5 font-mono text-xs shadow-sm sm:top-auto sm:right-4 sm:bottom-4",
          className
        )}
        onClick={() => setOpen(true)}
        type="button"
      >
        contrast
      </button>
    )
  }

  return (
    <aside
      className={cn(
        "fixed right-4 bottom-4 z-50 flex max-h-[70vh] w-[26rem] flex-col overflow-hidden rounded-xl border bg-card shadow-lg",
        className
      )}
      {...props}
    >
      <header className="flex items-center gap-2 border-b px-3 py-2">
        <span className="font-medium text-sm">Contrast</span>
        <span className="text-muted-foreground text-xs">
          {failing.length} failing · {pairs.length} pairs
        </span>
        <button
          className="ml-auto text-muted-foreground text-xs hover:text-foreground"
          onClick={() => setShowAll((v) => !v)}
          type="button"
        >
          {showAll ? "failing" : "all"}
        </button>
        <button
          aria-label="Close"
          className="text-muted-foreground text-xs hover:text-foreground"
          onClick={() => setOpen(false)}
          type="button"
        >
          ✕
        </button>
      </header>

      <div className="overflow-y-auto">
        {rows.length === 0 ? (
          <p className="px-3 py-6 text-center text-muted-foreground text-xs">
            Every pair meets its threshold.
          </p>
        ) : (
          <ul className="divide-y">
            {rows.map((p) => (
              <li className="flex items-center gap-2.5 px-3 py-2" key={`${p.fg}${p.bg}${p.fontPx}${p.weight}`}>
                <span
                  className="size-7 shrink-0 rounded border"
                  style={{ background: p.bg, color: p.fg }}
                >
                  <span className="flex size-full items-center justify-center font-medium text-[11px]">
                    Aa
                  </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs">{p.text || p.sample}</span>
                  <span className="truncate font-mono text-[11px] text-muted-foreground">
                    {p.fg} on {p.bg} · {p.fontPx}px {p.weight}
                    {p.count > 1 ? ` · ×${p.count}` : ""}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-mono text-xs",
                    p.passes ? "text-muted-foreground" : "text-destructive"
                  )}
                >
                  {p.ratio.toFixed(2)}
                  <span className="text-muted-foreground">/{p.threshold}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
