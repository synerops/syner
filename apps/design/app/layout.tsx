import type { Metadata } from "next";
import { geistSans, geistMono } from "@syner/ui/fonts";
import "@syner/ui/globals.css";

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
