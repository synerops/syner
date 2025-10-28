'use client';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/components/layout.client';

export default function Layout({ children }: LayoutProps<'/'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
