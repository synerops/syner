/**
 * Satori-compatible font loaders for OG image generation.
 *
 * Satori requires fonts as ArrayBuffer in .ttf or .woff format (not .woff2).
 * Fonts are static files committed to the repo (src/fonts/static/).
 *
 * Usage with next/og ImageResponse:
 * ```tsx
 * import { loadGeistSans, loadGeistMono } from "@syner/ui/fonts/satori";
 *
 * const sans = await loadGeistSans();
 * const mono = await loadGeistMono();
 *
 * new ImageResponse(<div>Hello</div>, {
 *   fonts: [
 *     { name: "Geist Sans", data: sans, style: "normal", weight: 400 },
 *     { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
 *   ],
 * });
 * ```
 */

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FONTS_DIR = join(dirname(fileURLToPath(import.meta.url)), "static");

/**
 * Load Geist Sans Regular as ArrayBuffer for Satori.
 */
export async function loadGeistSans(): Promise<ArrayBuffer> {
  const buffer = await readFile(join(FONTS_DIR, "Geist-Regular.ttf"));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

/**
 * Load Geist Mono Regular as ArrayBuffer for Satori.
 */
export async function loadGeistMono(): Promise<ArrayBuffer> {
  const buffer = await readFile(join(FONTS_DIR, "GeistMono-Regular.ttf"));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}
