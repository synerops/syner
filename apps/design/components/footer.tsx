import { Separator } from "@syner/ui/components/separator";

export function Footer() {
  return (
    <footer className="w-full px-8 py-8">
      <Separator className="mb-8" />
      <div className="mx-auto flex max-w-4xl items-center justify-between text-sm text-muted-foreground">
        <p>
          built with{" "}
          <a
            href="https://github.com/synerops/syner"
            className="underline underline-offset-4 hover:text-foreground"
          >
            syner
          </a>
        </p>
        <div className="flex items-center gap-4">
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
    </footer>
  );
}
