/**
 * Highlights slide template.
 *
 * Bullet-point list for key highlights.
 * Expects `slide.content` as `string[]`.
 */

import { registerTemplate } from "../registry";
import type { Template, Slide, Style } from "../types";

const highlightsTemplate: Template = {
  name: "highlights",
  defaultStyle: {
    backgroundColor: "#000000",
    color: "#fafafa",
    fontFamily: "Geist Sans",
    fontSize: 32,
    padding: 60,
    gap: 24,
  },
  render(slide: Slide, deckStyle?: Style) {
    const style = { ...this.defaultStyle, ...deckStyle, ...slide.style };
    const items = Array.isArray(slide.content) ? slide.content : [];

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
        }}
      >
        {slide.heading && (
          <div
            style={{
              display: "flex",
              fontSize: Math.round((style.fontSize ?? 32) * 1.25),
              fontWeight: 600,
              marginBottom: 32,
            }}
          >
            {slide.heading}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: style.gap,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 16,
                fontSize: style.fontSize,
              }}
            >
              <div style={{ display: "flex", color: "#525252" }}>{"\u2022"}</div>
              <div style={{ display: "flex", flex: 1 }}>{item}</div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

registerTemplate(highlightsTemplate);

export default highlightsTemplate;
