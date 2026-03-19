/**
 * Core type system for slide generation.
 *
 * These types define the contract for Satori-compatible slide rendering.
 * Used by syner.design (rendering pipeline), syner.md (deck routes),
 * and syner.bot (slide chain delivery).
 */

import type { ReactElement } from "react";

/**
 * Visual style properties for slides.
 * Satori constraint: flexbox only, no CSS Grid, no CSS variables.
 */
export interface Style {
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  padding?: number;
  gap?: number;
}

/**
 * A single slide in a deck.
 */
export interface Slide {
  /** Template name to render with (e.g. "title", "metrics", "highlights") */
  template: string;
  /** Main heading text */
  heading?: string;
  /** Secondary text below the heading */
  subtitle?: string;
  /** Body content — interpretation depends on the template */
  content?: string | string[] | Record<string, string | number>;
  /** Style overrides for this slide */
  style?: Partial<Style>;
}

/**
 * An ordered collection of slides with shared style.
 */
export interface Deck {
  /** Unique identifier for the deck */
  id?: string;
  /** Deck title */
  title: string;
  /** Ordered slides */
  slides: Slide[];
  /** Shared style applied to all slides (individual slides can override) */
  style?: Style;
}

/**
 * A slide template definition.
 * Templates are registered in the registry and resolved by name.
 */
export interface Template {
  /** Unique template name */
  name: string;
  /** Render a slide using this template. Returns Satori-compatible JSX. */
  render: (slide: Slide, deckStyle?: Style) => ReactElement;
  /** Default style for slides using this template */
  defaultStyle?: Style;
}
