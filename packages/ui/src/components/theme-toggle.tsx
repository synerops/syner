"use client"

import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import type * as React from "react"

import { Button } from "@syner/ui/components/button"
import { cn } from "@syner/ui/lib/utils"

// Both icons stay mounted and cross-fade with scale, opacity and blur, so the
// swap reads as one icon changing rather than two icons appearing. Keeping them
// in the DOM also means the server and client markup match, with no flash on
// hydration.
//
// The cross-fade does not play on a click today: ThemeProvider passes
// `disableTransitionOnChange`, which injects `* { transition: none }` for the
// frame the theme class flips, so the icon snaps along with the rest of the
// page. That is deliberate — a theme switch that smears looks worse than one
// that snaps. Drop that prop and this animates.
const icon =
  "absolute transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"

export function ThemeToggle({
  variant = "ghost",
  size = "icon-sm",
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      aria-label="Toggle theme"
      className={cn("relative", className)}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      size={size}
      variant={variant}
      {...props}
    >
      <Sun className={cn(icon, "scale-100 opacity-100 blur-none dark:scale-25 dark:opacity-0 dark:blur-[4px]")} />
      <Moon className={cn(icon, "scale-25 opacity-0 blur-[4px] dark:scale-100 dark:opacity-100 dark:blur-none")} />
    </Button>
  )
}
