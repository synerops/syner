import localFont from 'next/font/local';

/**
 * Roboto - Sans-serif variable font
 * Axes: wdth (width), wght (weight)
 */
export const roboto = localFont({
  src: [
    {
      path: '../fonts/roboto/Roboto-VariableFont_wdth,wght.ttf',
      style: 'normal',
    },
    {
      path: '../fonts/roboto/Roboto-Italic-VariableFont_wdth,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-roboto',
  display: 'swap',
});

/**
 * Roboto Mono - Monospace variable font
 * Axes: wght (weight)
 */
export const robotoMono = localFont({
  src: [
    {
      path: '../fonts/roboto-mono/RobotoMono-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: '../fonts/roboto-mono/RobotoMono-Italic-VariableFont_wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-roboto-mono',
  display: 'swap',
});

/**
 * Roboto Serif - Serif variable font
 * Axes: GRAD (grade), opsz (optical size), wdth (width), wght (weight)
 */
export const robotoSerif = localFont({
  src: [
    {
      path: '../fonts/roboto-serif/RobotoSerif-VariableFont_GRAD,opsz,wdth,wght.ttf',
      style: 'normal',
    },
    {
      path: '../fonts/roboto-serif/RobotoSerif-Italic-VariableFont_GRAD,opsz,wdth,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-roboto-serif',
  display: 'swap',
});

/**
 * Combined font class names for use in layout
 * @example
 * <body className={fonts}>
 */
export const fonts = [
  roboto.variable,
  robotoMono.variable,
  robotoSerif.variable,
  'font-sans antialiased',
].join(' ');
