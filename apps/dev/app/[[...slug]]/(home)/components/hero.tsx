import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@syner/ui/components/button";
import { Logo as SynerLogo } from "@syner/ui/branding/logo";

export const Hero = () => (
  <section className="flex flex-col items-center justify-center gap-6 bg-dashed px-4 py-16 sm:px-16 sm:py-24">
    <a
      className="inline-flex w-full items-center gap-2 overflow-hidden rounded-full border bg-background py-1 pr-3 pl-1 text-foreground text-sm leading-6 shadow-xs sm:w-fit"
      href="https://x.com/synerops"
      rel="noreferrer"
      target="_blank"
    >
      <span className="rounded-full bg-secondary px-2 font-semibold">
        Alpha
      </span>
      <span className="truncate font-medium">Announcing Syner OS</span>
    </a>
    <h1 className="max-w-3xl text-balance text-center font-semibold text-4xl leading-tight tracking-tighter! sm:text-5xl md:max-w-4xl md:text-6xl lg:leading-[1.1]">
      Create AI agents with{" "}
      <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        markdown files
      </span>
    </h1>
    <p className="max-w-xl text-balance text-center text-muted-foreground md:max-w-2xl md:text-lg">
      Define agents using SKILL.md and AGENT.md files. No programming required.
      Syner OS implements the OS Protocol for building multi-agentic systems.
    </p>
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <Button asChild size="lg">
        <Link href="/docs">Get Started</Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <a
          href="https://github.com/synerops/syner"
          target="_blank"
          rel="noreferrer"
        >
          <Github className="mr-2 h-4 w-4" />
          View on GitHub
        </a>
      </Button>
    </div>
  </section>
);
