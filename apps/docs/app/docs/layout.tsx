import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseLayoutConfig } from '@/lib/config';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.pageTree} {...baseLayoutConfig}>
      {children}
    </DocsLayout>
  );
}
