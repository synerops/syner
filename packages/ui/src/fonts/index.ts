/**
 * syner.design typography
 *
 * Geist font family - the official typeface for syner.
 *
 * Usage in app layout:
 * ```tsx
 * import { geistSans, geistMono, geistPixelSquare } from "@syner/ui/fonts";
 *
 * <html className={`${geistSans.variable} ${geistMono.variable} ${geistPixelSquare.variable}`}>
 *   <body className="font-sans">
 * ```
 *
 * CSS variables registered:
 * - --font-geist-sans
 * - --font-geist-mono
 * - --font-geist-pixel-square (and other pixel variants)
 */

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";

// Named exports matching the package structure
export { GeistSans } from "geist/font/sans";
export { GeistMono } from "geist/font/mono";
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

// Pixel font aliases
export const geistPixelSquare = GeistPixelSquare;
export const geistPixelGrid = GeistPixelGrid;
export const geistPixelCircle = GeistPixelCircle;
export const geistPixelTriangle = GeistPixelTriangle;
export const geistPixelLine = GeistPixelLine;
