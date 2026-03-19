/**
 * Metrics slide template.
 *
 * Displays key metrics as large numbers with labels.
 * Expects `slide.content` as `Record<string, string | number>`.
 */

import { registerTemplate } from "../registry";
import type { Template, Slide, Style } from "../types";

const metricsTemplate: Template = {
  name: "metrics",
  defaultStyle: {
    backgroundColor: "#000000",
    color: "#fafafa",
    fontFamily: "Geist Sans",
    fontSize: 48,
    padding: 60,
    gap: 40,
  },
  render(slide: Slide, deckStyle?: Style) {
    const style = { ...this.defaultStyle, ...deckStyle, ...slide.style };
    const entries =
      slide.content && typeof slide.content === "object" && !Array.isArray(slide.content)
        ? Object.entries(slide.content)
        : [];

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
              fontSize: Math.round((style.fontSize ?? 48) * 0.6),
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
            flexDirection: "row",
            flexWrap: "wrap",
            gap: style.gap,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {entries.map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 180,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: style.fontSize,
                  fontWeight: 700,
                  fontFamily: "Geist Mono",
                }}
              >
                {String(value)}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: Math.round((style.fontSize ?? 48) * 0.35),
                  color: "#a3a3a3",
                  marginTop: 8,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

registerTemplate(metricsTemplate);

export default metricsTemplate;
