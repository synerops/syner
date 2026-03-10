import { Logo } from "@syner/ui/branding";

export function Footer() {
  return (
    <footer className="w-full px-8 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-5 w-5 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">
              // built with syner
            </span>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
            <a
              href="https://github.com/synerops/syner"
              className="hover:text-foreground"
            >
              github
            </a>
            <a href="https://syner.dev" className="hover:text-foreground">
              docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
