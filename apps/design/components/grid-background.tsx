/**
 * Grid background - radically minimal
 *
 * Almost invisible, just enough to give spatial awareness.
 */
export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Ultra-minimal diagonal texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(315deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
          backgroundSize: "8px 8px",
          backgroundAttachment: "fixed",
          color: "oklch(from var(--foreground) l c h / 0.02)",
        }}
      />
      {/* Corner markers - just hints */}
      <div className="absolute left-8 top-8 h-3 w-3 border-l border-t border-foreground/10" />
      <div className="absolute right-8 top-8 h-3 w-3 border-r border-t border-foreground/10" />
      <div className="absolute bottom-8 left-8 h-3 w-3 border-b border-l border-foreground/10" />
      <div className="absolute bottom-8 right-8 h-3 w-3 border-b border-r border-foreground/10" />
    </div>
  );
}

/**
 * Typography grid - for specimen pages only
 */
export function TypographyGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Horizontal baseline guides */}
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-foreground/5" />

      {/* Vertical center guide */}
      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-foreground/5" />

      {/* Corner markers */}
      <div className="absolute left-8 top-8 h-3 w-3 border-l border-t border-foreground/10" />
      <div className="absolute right-8 top-8 h-3 w-3 border-r border-t border-foreground/10" />
      <div className="absolute bottom-8 left-8 h-3 w-3 border-b border-l border-foreground/10" />
      <div className="absolute bottom-8 right-8 h-3 w-3 border-b border-r border-foreground/10" />
    </div>
  );
}

/**
 * No grid - just corner markers
 * For absolute minimal pages
 */
export function MinimalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Corner markers only */}
      <div className="absolute left-8 top-8 h-3 w-3 border-l border-t border-foreground/10" />
      <div className="absolute right-8 top-8 h-3 w-3 border-r border-t border-foreground/10" />
      <div className="absolute bottom-8 left-8 h-3 w-3 border-b border-l border-foreground/10" />
      <div className="absolute bottom-8 right-8 h-3 w-3 border-b border-r border-foreground/10" />
    </div>
  );
}
