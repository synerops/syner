import type { Metadata } from "next";
import {
  geistSans,
  geistMono,
  geistPixelSquare,
} from "@syner/ui/fonts";
import "@syner/ui/globals.css";
import { ThemeProvider } from "@syner/ui/components/theme-provider";
import { GridBackground } from "@/components/grid-background";

export const metadata: Metadata = {
  title: "syner.design",
  description: "agentic design system — components that agents understand and generate",
  metadataBase: new URL("https://syner.design"),
  openGraph: {
    title: "syner.design",
    description: "agentic design system — components that agents understand and generate",
    siteName: "syner.design",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "syner.design",
    description: "agentic design system — components that agents understand and generate",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${geistPixelSquare.variable}`}
    >
      <body className="relative font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GridBackground />
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
