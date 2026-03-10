/**
 * Grid background inspired by vercel.com/font
 *
 * Creates a subtle dotted grid pattern that gives the page
 * a design tool / blueprint aesthetic.
 */
export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Main grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(255 255 255 / 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Secondary smaller grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgb(255 255 255 / 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "16px 16px",
        }}
      />
      {/* Corner markers */}
      <div className="absolute left-8 top-8 h-4 w-4 border-l border-t border-white/10" />
      <div className="absolute right-8 top-8 h-4 w-4 border-r border-t border-white/10" />
      <div className="absolute bottom-8 left-8 h-4 w-4 border-b border-l border-white/10" />
      <div className="absolute bottom-8 right-8 h-4 w-4 border-b border-r border-white/10" />
    </div>
  );
}

/**
 * Alternative grid with horizontal baseline markers
 * Like the typography specimen view on vercel.com/font
 */
export function TypographyGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Horizontal baseline guides */}
      <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-white/5" />
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/5" />
      <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-white/5" />

      {/* Vertical column guides */}
      <div className="absolute inset-y-0 left-1/4 border-l border-dashed border-white/5" />
      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-white/5" />
      <div className="absolute inset-y-0 left-3/4 border-l border-dashed border-white/5" />

      {/* Cross markers at intersections */}
      {[1, 2, 3].map((row) =>
        [1, 2, 3].map((col) => (
          <div
            key={`${row}-${col}`}
            className="absolute h-2 w-2"
            style={{
              left: `${col * 25}%`,
              top: `${row * 25}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="absolute left-1/2 top-0 h-full w-px bg-white/10" />
            <div className="absolute left-0 top-1/2 h-px w-full bg-white/10" />
          </div>
        ))
      )}
    </div>
  );
}
