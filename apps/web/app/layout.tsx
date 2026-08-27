import type { Metadata } from "next"
import { brand } from "@syner/ui/branding"
import { fonts } from "@syner/ui/lib/fonts"

import "@syner/ui/globals.css"

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fonts}>{children}</body>
    </html>
  )
}
