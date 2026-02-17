import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

// Custom frontmatter schema for components
const componentSchema = frontmatterSchema.extend({
  component: z.string().optional(),
  description: z.string().optional(),
});

export const components = defineDocs({
  dir: 'content/components',
  docs: {
    schema: componentSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
