import { Separator } from "@syner/ui/components/separator";

export function Footer() {
  return (
    <footer className="w-full px-8 py-8 font-mono">
      <Separator className="mb-8" />
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {"// built with "}
            <a
              href="https://github.com/synerops/syner"
              className="underline underline-offset-4 hover:text-foreground"
            >
              syner
            </a>
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a
              href="https://github.com/synerops/syner"
              className="hover:text-foreground"
            >
              github
            </a>
            <span className="text-border">|</span>
            <a href="https://syner.dev" className="hover:text-foreground">
              docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
