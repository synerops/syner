import type { Metadata } from "next";
import { geistSans, geistMono, geistPixelSquare } from "@syner/ui/fonts";
import { ThemeProvider } from "@syner/ui/components/theme-provider";
import { Header } from "@syner/ui/components/header";
import { Footer } from "@syner/ui/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "syner.dev",
  description: "The developer portal for syner.",
};

const nav = [
  { label: "Explore", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Studio", href: "/studio" },
];

const footerColumns = [
  {
    label: "Portal",
    links: [
      { label: "Explore", href: "/" },
      { label: "Docs", href: "/docs" },
      { label: "Studio", href: "/studio" },
    ],
  },
  {
    label: "Ecosystem",
    links: [
      { label: "syner.md", href: "https://syner.md" },
      { label: "syner.bot", href: "https://syner.bot" },
      { label: "syner.design", href: "https://syner.design" },
    ],
  },
];

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
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header
            domain="dev"
            nav={nav}
            githubUrl="https://github.com/rbadillap"
          />
          <main className="flex-1">{children}</main>
          <Footer
            domain="dev"
            tagline="The developer portal for syner — discover skills, agents, and how the agentic OS works."
            columns={footerColumns}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
