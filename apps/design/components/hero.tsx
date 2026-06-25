import { Logo } from "@syner/ui/branding";
import { Button } from "@syner/ui/components/button";
import { geistPixelSquare } from "@syner/ui/fonts";

export function Hero() {
  return (
    <section className="w-full px-8 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-10">
          {/* Logo mark */}
          <Logo className="h-16 w-16 md:h-20 md:w-20" />

          {/* Title block */}
          <div className="flex flex-col gap-2">
            <h1
              className={`${geistPixelSquare.className} text-5xl tracking-tight md:text-6xl lg:text-7xl`}
            >
              syner.design
            </h1>
            <div className="h-px w-32 bg-border" />
            <p className="font-mono text-sm text-muted-foreground">
              // agentic design system
            </p>
          </div>

          {/* Description */}
          <div className="flex max-w-lg flex-col gap-2">
            <p className="font-mono text-base text-muted-foreground md:text-lg">
              components that agents understand and generate.
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              markdown specs for humans and agents.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button disabled className="font-mono text-sm">
              coming soon
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
