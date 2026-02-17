import '@syner/ui/globals.css';
import './global.css';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { fonts } from '@syner/ui/lib/fonts';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Toaster } from '@syner/ui/components/sonner';
import { TooltipProvider } from '@syner/ui/components/tooltip';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'Syner Design System',
  description: 'Component documentation and design system for Syner UI',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className={fonts} lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
