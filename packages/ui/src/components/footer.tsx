import * as React from "react"

import { Logo } from "@syner/ui/branding"
import { cn } from "@syner/ui/lib/utils"

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  label: string
  links: FooterLink[]
}

interface FooterProps extends React.ComponentProps<"footer"> {
  /** Property suffix after the wordmark, e.g. "dev" renders syner<.dev>. */
  domain?: string
  /** Short description shown under the wordmark. */
  tagline?: string
  /** Link columns (e.g. Portal, Ecosystem). */
  columns?: FooterColumn[]
}

function Footer({
  domain,
  tagline,
  columns = [],
  className,
  ...props
}: FooterProps) {
  const suffix = domain ? `.${domain}` : ""

  return (
    <footer
      data-slot="footer"
      className={cn("border-t border-border", className)}
      {...props}
    >
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs space-y-3">
            <div className="flex items-center gap-2">
              <Logo className="h-5 w-5 text-foreground" />
              <span className="font-pixel text-sm">
                syner
                {domain ? (
                  <span className="text-muted-foreground">.{domain}</span>
                ) : null}
              </span>
            </div>
            {tagline ? (
              <p className="text-sm text-muted-foreground">{tagline}</p>
            ) : null}
          </div>
          {columns.length > 0 ? (
            <div className="flex gap-16">
              {columns.map((col) => (
                <div key={col.label} className="space-y-3">
                  <h4 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                    {col.label}
                  </h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} synerops</span>
          <span>syner{suffix}</span>
        </div>
      </div>
    </footer>
  )
}

export { Footer, type FooterProps, type FooterColumn, type FooterLink }
