import { Logo } from "@syner/ui/branding";
import { geistPixelSquare } from "@syner/ui/fonts";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-border px-8 py-4">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className={`${geistPixelSquare.className} text-lg`}>syner</span>
          <Logo className="mx-1 h-4 w-4" />
          <span
            className={`${geistPixelSquare.className} text-lg text-muted-foreground`}
          >
            design
          </span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
          <Link href="/components" className="hover:text-foreground">
            components
          </Link>
          <a href="#tokens" className="hover:text-foreground">
            tokens
          </a>
          <a
            href="https://github.com/synerops/syner"
            className="hover:text-foreground"
          >
            github
          </a>
        </nav>
      </div>
    </header>
  );
}
