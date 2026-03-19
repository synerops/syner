/**
 * Outlook slide template.
 *
 * Forward-looking summary with heading, subtitle, and body text.
 * Expects `slide.content` as `string`.
 */

import { registerTemplate } from "../registry";
import type { Template, Slide, Style } from "../types";

const outlookTemplate: Template = {
  name: "outlook",
  defaultStyle: {
    backgroundColor: "#0a0a0a",
    color: "#fafafa",
    fontFamily: "Geist Sans",
    fontSize: 28,
    padding: 60,
  },
  render(slide: Slide, deckStyle?: Style) {
    const style = { ...this.defaultStyle, ...deckStyle, ...slide.style };
    const body = typeof slide.content === "string" ? slide.content : "";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: style.backgroundColor,
          color: style.color,
          fontFamily: style.fontFamily,
          padding: style.padding,
          justifyContent: "center",
        }}
      >
        {slide.heading && (
          <div
            style={{
              display: "flex",
              fontSize: Math.round((style.fontSize ?? 28) * 1.7),
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {slide.heading}
          </div>
        )}
        {slide.subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: Math.round((style.fontSize ?? 28) * 0.85),
              color: "#a3a3a3",
              marginBottom: 32,
            }}
          >
            {slide.subtitle}
          </div>
        )}
        {body && (
          <div
            style={{
              display: "flex",
              fontSize: style.fontSize,
              lineHeight: 1.6,
              color: "#d4d4d4",
            }}
          >
            {body}
          </div>
        )}
      </div>
    );
  },
};

registerTemplate(outlookTemplate);

export default outlookTemplate;
