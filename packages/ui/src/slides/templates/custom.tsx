/**
 * Custom slide template.
 *
 * Freeform layout — renders heading, subtitle, and content as-is.
 * Acts as a passthrough for slides that don't fit other templates.
 */

import { registerTemplate } from "../registry";
import type { Template, Slide, Style } from "../types";

const customTemplate: Template = {
  name: "custom",
  defaultStyle: {
    backgroundColor: "#000000",
    color: "#fafafa",
    fontFamily: "Geist Sans",
    fontSize: 28,
    padding: 60,
  },
  render(slide: Slide, deckStyle?: Style) {
    const style = { ...this.defaultStyle, ...deckStyle, ...slide.style };

    const renderContent = () => {
      if (!slide.content) return null;
      if (typeof slide.content === "string") {
        return (
          <div style={{ display: "flex", fontSize: style.fontSize, lineHeight: 1.5 }}>
            {slide.content}
          </div>
        );
      }
      if (Array.isArray(slide.content)) {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {slide.content.map((item, i) => (
              <div key={i} style={{ display: "flex", fontSize: style.fontSize }}>
                {item}
              </div>
            ))}
          </div>
        );
      }
      // Record<string, string | number>
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.entries(slide.content).map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 12, fontSize: style.fontSize }}>
              <div style={{ display: "flex", fontWeight: 600 }}>{k}:</div>
              <div style={{ display: "flex" }}>{String(v)}</div>
            </div>
          ))}
        </div>
      );
    };

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
              marginBottom: 24,
            }}
          >
            {slide.subtitle}
          </div>
        )}
        {renderContent()}
      </div>
    );
  },
};

registerTemplate(customTemplate);

export default customTemplate;
