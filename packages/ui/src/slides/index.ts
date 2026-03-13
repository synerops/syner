/**
 * @syner/ui/slides — Slide generation infrastructure.
 *
 * Types, registry, and rendering for Satori-compatible slide decks.
 *
 * ```tsx
 * import { type Slide, type Deck, registerTemplate, renderSlide } from "@syner/ui/slides";
 * ```
 */

// Types
export type { Style, Slide, Deck, Template } from "./types";

// Registry
export {
  registerTemplate,
  getTemplate,
  listTemplates,
  renderSlide,
} from "./registry";
