'use client';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import SynerLogo from '@/components/branding/logo';

export function baseOptions(): BaseLayoutProps {
  return {
    links:
    [
      {
        text: 'Docs',
        url: '/docs',
        secondary: false,
      },
      {
        text: 'API',
        url: '/api',
        secondary: false,
      },
      {
        text: 'Blog',
        url: '/blog',
        secondary: false,
      },
      {
        text: 'About',
        url: '/about',
        secondary: false,
      },
    ],
    nav: {
      title: (
        // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
        <div
          className="text-foreground text-[22px]"
          title="Right click for design assets"
          // onContextMenu={(e) => {
          //   e.preventDefault();
          //   const link = document.createElement('a');
          //   link.href = '/workflow-assets.zip';
          //   link.download = 'workflow-assets.zip';
          //   document.body.appendChild(link);
          //   link.click();
          //   document.body.removeChild(link);
          // }}
        >
          <span className="text-foreground text-lg font-semibold tracking-tight flex items-center gap-1.5">
            <SynerLogo
              className="hidden sm:block w-8 h-8"
              height={18}
              fill="currentColor"
            />
            syner
          </span>
        </div>
      ),
    },
  };
}
