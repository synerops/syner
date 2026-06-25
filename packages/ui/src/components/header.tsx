import * as React from "react"

import { Logo } from "@syner/ui/branding"
import { Button } from "@syner/ui/components/button"
import { GitHubIcon } from "@syner/ui/components/icons"
import { ThemeToggle } from "@syner/ui/components/theme-toggle"
import { cn } from "@syner/ui/lib/utils"

interface NavItem {
  label: string
  href: string
}

interface HeaderProps extends React.ComponentProps<"header"> {
  /** Property suffix after the wordmark, e.g. "dev" renders syner<.dev> with the suffix muted. */
  domain?: string
  /** Primary navigation links (hidden below md). */
  nav?: NavItem[]
  /** Optional GitHub URL — renders a ghost link button (handles Base UI's nativeButton internally). */
  githubUrl?: string
  /** Extra right-side content, rendered before the GitHub button and theme toggle. */
  actions?: React.ReactNode
  /** Link target for the wordmark. Defaults to "/". */
  homeHref?: string
  /** Render the built-in theme toggle on the right. Defaults to true. */
  themeToggle?: boolean
}

function Header({
  domain,
  nav = [],
  githubUrl,
  actions,
  homeHref = "/",
  themeToggle = true,
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      data-slot="header"
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <a href={homeHref} className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-foreground" />
            <span className="font-pixel text-base">
              syner
              {domain ? <span className="text-muted-foreground">.{domain}</span> : null}
            </span>
          </a>
          {nav.length > 0 ? (
            <nav className="hidden items-center gap-6 md:flex">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {actions}
          {githubUrl ? (
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              <GitHubIcon data-icon="inline-start" />
              GitHub
            </Button>
          ) : null}
          {themeToggle ? <ThemeToggle /> : null}
        </div>
      </div>
    </header>
  )
}

export { Header, type HeaderProps, type NavItem }
