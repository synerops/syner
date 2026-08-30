"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type * as React from "react"

// Wraps next-themes with the settings the shadcn tokens expect: the `.dark`
// class on <html> (see `@custom-variant dark` in globals.css) and system
// preference as the default.
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
