import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import { brand } from "@syner/ui/branding"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@syner/ui/components/sidebar"
import { ThemeProvider } from "@syner/ui/components/theme-provider"
import { TooltipProvider } from "@syner/ui/components/tooltip"
import { Canvas } from "@syner/ui/components/canvas"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNavBrand, MobileNavProvider } from "@/components/mobile-nav"

import "./globals.css"


// TEMPORARY font preview. Loads Inter, Cal Sans and Paper Mono from
// app/fonts and remaps the Roboto variables that @syner/ui/globals.css
// expects, so every `font-sans` / `font-mono` utility picks these up without
// touching the ui package. `@syner/ui/lib/fonts` is intentionally unused here.
// Revert: restore `fonts` from @syner/ui/lib/fonts and delete app/fonts.

const calSans = localFont({
  src: [
    { path: "./fonts/CalSansVF.woff2", style: "normal" },
    { path: "./fonts/CalSansVF-Italic.woff2", style: "italic" },
  ],
  weight: "300 700",
  variable: "--font-cal-sans",
  display: "swap",
})

const paperMono = localFont({
  src: "./fonts/PaperMono-Regular.woff2",
  variable: "--font-paper-mono",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const previewVars = {
  "--font-sans": "var(--font-inter)",
  "--font-heading": "var(--font-cal-sans)",
  "--font-mono": "var(--font-paper-mono)",
} as React.CSSProperties

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${calSans.variable} ${paperMono.variable}`}
      style={previewVars}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <TooltipProvider>
            <MobileNavProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
                  <SidebarTrigger className="max-md:hidden" />
                  <MobileNavBrand>{brand.name}</MobileNavBrand>
                  <span className="text-muted-foreground text-sm">/ design system</span>
                </header>
                {children}
              </SidebarInset>
              {process.env.NODE_ENV === "development" ? <Canvas /> : null}
            </SidebarProvider>
            </MobileNavProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
