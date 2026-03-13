/**
 * Slide template registry.
 *
 * Templates register by name and are resolved at render time.
 * Used by syner.design (rendering pipeline) and syner.md (OG routes).
 */

import type { Template, Slide, Style } from "./types";
import type { ReactElement } from "react";

const templates = new Map<string, Template>();

/**
 * Register a slide template. Throws if a template with the same name exists.
 */
export function registerTemplate(template: Template): void {
  if (templates.has(template.name)) {
    throw new Error(`Template "${template.name}" is already registered`);
  }
  templates.set(template.name, template);
}

/**
 * Get a registered template by name. Returns undefined if not found.
 */
export function getTemplate(name: string): Template | undefined {
  return templates.get(name);
}

/**
 * List all registered template names.
 */
export function listTemplates(): string[] {
  return Array.from(templates.keys());
}

/**
 * Render a slide using its registered template.
 * Throws if the template is not registered.
 */
export function renderSlide(slide: Slide, deckStyle?: Style): ReactElement {
  const template = templates.get(slide.template);
  if (!template) {
    throw new Error(
      `Unknown template "${slide.template}". Registered: ${listTemplates().join(", ") || "(none)"}`
    );
  }
  return template.render(slide, deckStyle);
}
