import { Logo } from "@syner/ui/branding";
import { Button } from "@syner/ui/components/button";
import { Input } from "@syner/ui/components/input";
import { geistPixelSquare } from "@syner/ui/fonts";
import { ArrowRight } from "lucide-react";

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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
                $
              </span>
              <Input
                placeholder="explore..."
                className="h-11 pl-8 font-mono text-sm"
              />
            </div>
            <Button className="gap-2 font-mono text-sm">
              get started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
