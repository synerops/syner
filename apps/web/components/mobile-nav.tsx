"use client"

import * as React from "react"
import { CaretUp } from "@phosphor-icons/react"

import { brand, Logo } from "@syner/ui/branding"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@syner/ui/components/drawer"
import { cn } from "@syner/ui/lib/utils"

import { groups, links, sections } from "@/components/nav"

type MobileNavState = {
  open: boolean
  setOpen: (open: boolean) => void
  /** Href of the section currently on screen, or null at the top of the page. */
  current: string | null
}

const MobileNavContext = React.createContext<MobileNavState | null>(null)

export function useMobileNav(): MobileNavState {
  const context = React.useContext(MobileNavContext)
  if (!context) throw new Error("useMobileNav must be used within MobileNavProvider")
  return context
}

/** Track which section is on screen, to mark the active row in the drawer. */
function useCurrentSection(): string | null {
  const [current, setCurrent] = React.useState<string | null>(null)

  React.useEffect(() => {
    const targets = sections
      .map((s) => document.querySelector(s.href))
      .filter((el): el is Element => el !== null)
    if (targets.length === 0) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(`#${e.target.id}`)
          else visible.delete(`#${e.target.id}`)
        }
        // The topmost section still on screen is the one being read.
        setCurrent(sections.find((s) => visible.has(s.href))?.href ?? null)
      },
      { rootMargin: "-72px 0px -60% 0px", threshold: 0 }
    )
    for (const t of targets) observer.observe(t)
    return () => observer.disconnect()
  }, [])

  return current
}

/**
 * Mobile navigation: a control anchored in the thumb zone that raises a bottom
 * drawer. Wraps the app so the header can raise the same drawer — otherwise the
 * brand up there reads as tappable and does nothing.
 */
export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const current = useCurrentSection()
  const value = React.useMemo(() => ({ open, setOpen, current }), [open, current])

  return (
    <MobileNavContext.Provider value={value}>
      {children}

      <button
        aria-expanded={open}
        aria-label="Open navigation"
        className={cn(
          "-translate-x-1/2 fixed left-1/2 z-40 flex min-h-11 items-center gap-2 rounded-full border bg-card/85 py-2 pr-3 pl-3.5 shadow-lg backdrop-blur-md md:hidden",
          "transition-[scale] duration-150 active:scale-[0.96]",
          // iOS Safari overlays the bottom of the layout viewport with its own
          // toolbar, so a plain bottom-4 puts this under the browser chrome and
          // taps never reach it.
          "bottom-[calc(--spacing(4)+env(safe-area-inset-bottom))]"
        )}
        onClick={() => setOpen(true)}
        type="button"
      >
        <Logo className="size-4 shrink-0" />
        <span className="font-medium text-sm">{brand.name}</span>
        <CaretUp className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      <Drawer onOpenChange={setOpen} open={open} showSwipeHandle>
        <DrawerContent className="md:hidden">
          <DrawerTitle className="sr-only">Navigation</DrawerTitle>
          <DrawerDescription className="sr-only">{brand.tagline}</DrawerDescription>

          <nav className="flex flex-col gap-5 overflow-y-auto px-3 pt-1 pb-[calc(--spacing(6)+env(safe-area-inset-bottom))]">
            {groups.map((group) => (
              <div className="flex flex-col gap-1" key={group.label}>
                <span className="px-3 py-1 font-medium text-muted-foreground text-xs">
                  {group.label}
                </span>
                {group.items.map((item) => {
                  const active = item.href === current
                  return (
                    <a
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-lg px-3 transition-[color,background-color] duration-150 active:bg-accent",
                        active ? "bg-accent font-medium" : "text-foreground"
                      )}
                      href={item.href}
                      key={item.title}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="size-4.5 shrink-0 text-muted-foreground" />
                      {item.title}
                    </a>
                  )
                })}
              </div>
            ))}

            <div className="flex flex-col gap-1 border-t pt-4">
              {links.map((link) => (
                <a
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-foreground transition-[background-color] duration-150 active:bg-accent"
                  href={link.href}
                  key={link.title}
                  onClick={() => setOpen(false)}
                  rel="noreferrer"
                  target="_blank"
                >
                  <link.icon className="size-4.5 shrink-0 text-muted-foreground" />
                  {link.title}
                </a>
              ))}
            </div>
          </nav>
        </DrawerContent>
      </Drawer>
    </MobileNavContext.Provider>
  )
}

/**
 * The brand in the header. A button on mobile, where it opens the drawer;
 * plain text on desktop, where the sidebar is already visible.
 */
export function MobileNavBrand({ children }: { children: React.ReactNode }) {
  const { setOpen } = useMobileNav()

  return (
    <button
      aria-label="Open navigation"
      className="-mx-2 flex min-h-11 items-center rounded-lg px-2 font-medium text-sm md:pointer-events-none md:min-h-0"
      onClick={() => setOpen(true)}
      type="button"
    >
      {children}
    </button>
  )
}
