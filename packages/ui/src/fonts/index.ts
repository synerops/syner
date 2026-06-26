/**
 * syner typography
 *
 * Sans:  Inter (the design system's sans typeface).
 * Mono:  Geist Mono (Berkeley Mono accent layered in globals via @font-face).
 * Pixel: Geist Pixel (wordmark).
 *
 * Usage in app layout:
 * ```tsx
 * import { inter, geistMono, geistPixelSquare } from "@syner/ui/fonts";
 *
 * <html className={`${inter.variable} ${geistMono.variable} ${geistPixelSquare.variable}`}>
 *   <body className="font-sans">
 * ```
 *
 * CSS variables registered:
 * - --font-inter
 * - --font-geist-mono
 * - --font-geist-pixel-square (and other pixel variants)
 */

import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";

// Sans — Inter
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Geist family — mono + pixel (GeistSans kept for back-compat)
export { GeistSans } from "geist/font/sans";
export { GeistMono } from "geist/font/mono";
export {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";

export const geistSans = GeistSans;
export const geistMono = GeistMono;
export const geistPixelSquare = GeistPixelSquare;
export const geistPixelGrid = GeistPixelGrid;
export const geistPixelCircle = GeistPixelCircle;
export const geistPixelTriangle = GeistPixelTriangle;
export const geistPixelLine = GeistPixelLine;
