'use client';

import { cn } from '@syner/ui/lib/utils';
import type { ReactNode } from 'react';

export interface ComponentPreviewProps {
  children: ReactNode;
  className?: string;
  align?: 'center' | 'start' | 'end';
}

export function ComponentPreview({
  children,
  className,
  align = 'center',
}: ComponentPreviewProps) {
  const alignClasses = {
    center: 'items-center justify-center',
    start: 'items-start justify-start',
    end: 'items-end justify-end',
  };

  return (
    <div
      className={cn(
        'component-preview flex min-h-[350px] w-full',
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}
