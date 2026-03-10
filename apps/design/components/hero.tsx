import { Badge } from "@syner/ui/components/badge";
import { Input } from "@syner/ui/components/input";
import { geistPixelSquare } from "@syner/ui/fonts";

export function Hero() {
  return (
    <section className="relative w-full px-8 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-8">
          <Badge
            variant="outline"
            className="w-fit font-mono text-xs lowercase tracking-wide"
          >
            {"// agentic design system"}
          </Badge>

          <div className="flex flex-col gap-4">
            {/* Pixel font title */}
            <h1
              className={`${geistPixelSquare.className} text-6xl tracking-tight md:text-7xl lg:text-8xl`}
            >
              syner<span className="text-muted-foreground">.</span>
            </h1>
            <p className="max-w-lg font-mono text-base text-muted-foreground md:text-lg">
              components that agents understand and generate.
            </p>
          </div>

          <div className="flex flex-col gap-4">
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

            <p className="font-mono text-xs text-muted-foreground">
              markdown specs that both humans and agents read.
            </p>
          </div>
        </div>

        {/* Decorative baseline markers */}
        <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-1 font-mono text-xs text-muted-foreground/50 xl:flex">
          <span className="border-t border-dashed border-white/10 pl-4">
            722
          </span>
          <span className="border-t border-dashed border-white/10 pl-4">
            532
          </span>
          <span className="border-t border-dashed border-white/10 pl-4">0</span>
        </div>
      </div>
    </section>
  );
}
