/**
 * Title slide template.
 *
 * Full-screen headline with optional subtitle. Used as the opening slide.
 */

import { registerTemplate } from "../registry";
import type { Template, Slide, Style } from "../types";

const titleTemplate: Template = {
  name: "title",
  defaultStyle: {
    backgroundColor: "#000000",
    color: "#fafafa",
    fontFamily: "Geist Sans",
    fontSize: 64,
    padding: 80,
  },
  render(slide: Slide, deckStyle?: Style) {
    const style = { ...this.defaultStyle, ...deckStyle, ...slide.style };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: style.backgroundColor,
          color: style.color,
          fontFamily: style.fontFamily,
          padding: style.padding,
        }}
      >
        {slide.heading && (
          <div
            style={{
              display: "flex",
              fontSize: style.fontSize,
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            {slide.heading}
          </div>
        )}
        {slide.subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: Math.round((style.fontSize ?? 64) * 0.4),
              color: "#a3a3a3",
              marginTop: 24,
              textAlign: "center",
            }}
          >
            {slide.subtitle}
          </div>
        )}
      </div>
    );
  },
};

registerTemplate(titleTemplate);

export default titleTemplate;
