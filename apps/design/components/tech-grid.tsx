const techs = ["next.js", "react", "tailwind", "shadcn/ui", "geist"];

export function TechGrid() {
  return (
    <section className="w-full border-y border-border px-8 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
          <span className="mr-2">// stack</span>
          {techs.map((tech, i) => (
            <span key={tech} className="flex items-center">
              <span>{tech}</span>
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
