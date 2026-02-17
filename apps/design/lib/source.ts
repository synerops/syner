import { components } from '@/source.config';
import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';

export const source = loader({
  baseUrl: '/components',
  source: createMDXSource(components.files, components.meta),
});
