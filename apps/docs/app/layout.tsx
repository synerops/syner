import "./global.css"

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { fonts } from '@syner/ui/lib/fonts';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { ThemeProvider } from './providers/theme';
import { Toaster } from '@syner/ui/components/sonner';
import { TooltipProvider } from '@syner/ui/components/tooltip';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://syner.dev'),
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      className={fonts}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <RootProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </RootProvider>
          <VercelAnalytics />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
