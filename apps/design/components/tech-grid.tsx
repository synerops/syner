const techs = [
  { name: "next.js", version: "15" },
  { name: "react", version: "19" },
  { name: "tailwind", version: "4" },
  { name: "shadcn/ui", version: "2" },
  { name: "geist", version: "1.7" },
];

export function TechGrid() {
  return (
    <section className="w-full border-y border-border px-8 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
          <span className="mr-2">// stack</span>
          {techs.map((tech, i) => (
            <span key={tech.name} className="flex items-center">
              <span>{tech.name}</span>
              <span className="text-muted-foreground/50 ml-1">
                v{tech.version}
              </span>
              {i < techs.length - 1 && (
                <span className="mx-2 text-border">•</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
