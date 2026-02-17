'use client';

import { cn } from '@syner/ui/lib/utils';
import type { ReactNode } from 'react';

export interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function CodeBlock({ children, className, title }: CodeBlockProps) {
  return (
    <div className={cn('code-block overflow-hidden', className)}>
      {title && (
        <div className="border-b bg-muted/30 px-4 py-2 text-sm font-medium">
          {title}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
