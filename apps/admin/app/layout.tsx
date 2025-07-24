import "@syner/ui/globals.css"
import { Providers } from "./providers"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
    >
    <Providers>{children}</Providers>
    </body>
    </html>
  )
}
