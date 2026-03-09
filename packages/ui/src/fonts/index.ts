/**
 * syner.design typography
 *
 * Geist font family - the official typeface for syner.
 *
 * Usage in app layout:
 * ```tsx
 * import { geistSans, geistMono } from "@syner/ui/fonts";
 *
 * <html className={`${geistSans.variable} ${geistMono.variable}`}>
 *   <body className="font-sans">
 * ```
 *
 * CSS variables registered:
 * - --font-geist-sans
 * - --font-geist-mono
 */

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

// Named exports matching the package structure
export { GeistSans } from "geist/font/sans";
export { GeistMono } from "geist/font/mono";

// Pixel fonts for display/decorative use
export {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";

// Convenient lowercase aliases
export const geistSans = GeistSans;
export const geistMono = GeistMono;
