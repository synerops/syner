import { Badge } from "@syner/ui/components/badge";
import { Input } from "@syner/ui/components/input";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-8 px-8 py-24 text-center">
      <Badge
        variant="outline"
        className="font-mono text-xs uppercase tracking-widest"
      >
        agentic design system
      </Badge>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-6xl font-bold tracking-tight">
          syner<span className="text-muted-foreground">.design</span>
        </h1>
        <p className="max-w-lg text-xl text-muted-foreground">
          Components that agents understand and generate.
        </p>
      </div>

      <div className="relative w-full max-w-md">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
          $
        </span>
        <Input
          placeholder="explore components..."
          className="h-12 pl-8 font-mono text-sm"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
            /
          </kbd>
        </div>
      </div>

      <p className="max-w-md text-sm text-muted-foreground">
        Markdown specs that both humans and agents read.
      </p>
    </section>
  );
}
