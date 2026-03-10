import type { Metadata } from "next";
import {
  geistSans,
  geistMono,
  geistPixelSquare,
} from "@syner/ui/fonts";
import "@syner/ui/globals.css";
import { GridBackground } from "@/components/grid-background";

export const metadata: Metadata = {
  title: "syner.design",
  description: "Design system for the syner ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${geistPixelSquare.variable} dark`}
    >
      <body className="relative font-sans antialiased">
        <GridBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
