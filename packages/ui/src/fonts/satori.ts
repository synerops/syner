/**
 * Satori-compatible font loaders for OG image generation.
 *
 * Satori requires fonts as ArrayBuffer in .ttf or .woff format (not .woff2).
 * These loaders read Geist fonts from the `geist` package at runtime.
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
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function resolveGeistFont(path: string): string {
  const geistDir = require.resolve("geist/package.json").replace("/package.json", "");
  return `${geistDir}/dist/fonts/${path}`;
}

/**
 * Load Geist Sans Regular as ArrayBuffer for Satori.
 */
export async function loadGeistSans(): Promise<ArrayBuffer> {
  const fontPath = resolveGeistFont("geist-sans/Geist-Regular.ttf");
  const buffer = await readFile(fontPath);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

/**
 * Load Geist Mono Regular as ArrayBuffer for Satori.
 */
export async function loadGeistMono(): Promise<ArrayBuffer> {
  const fontPath = resolveGeistFont("geist-mono/GeistMono-Regular.ttf");
  const buffer = await readFile(fontPath);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}
