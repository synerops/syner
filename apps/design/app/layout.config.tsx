import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: 'Syner Design',
  },
  links: [
    {
      text: 'Documentation',
      url: '/components',
      active: 'nested-url',
    },
  ],
};
