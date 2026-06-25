"use client"

import { Moon, Sun } from "@phosphor-icons/react/ssr"
import { useTheme } from "next-themes"

import { Button } from "@syner/ui/components/button"

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Icon visibility is driven by the .dark class, so it's SSR-safe (no hydration mismatch). */}
      <Sun weight="bold" className="hidden dark:block" />
      <Moon weight="bold" className="block dark:hidden" />
    </Button>
  )
}

export { ThemeToggle }
