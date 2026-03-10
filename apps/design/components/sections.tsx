import { Logo } from "@syner/ui/branding";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@syner/ui/components/card";
import { Palette, Type, MessageSquare, Layout, Grid3X3, PanelTop, PanelBottom } from "lucide-react";

const branding = [
  { name: "logo", icon: Logo, isLogo: true },
  { name: "colors", icon: Palette },
  { name: "typography", icon: Type },
  { name: "voice", icon: MessageSquare },
];

const components = [
  { name: "button", count: 6 },
  { name: "card", count: 2 },
  { name: "input", count: 1 },
  { name: "badge", count: 3 },
  { name: "separator", count: 1 },
];

const patterns = [
  { name: "hero", icon: PanelTop },
  { name: "grid", icon: Grid3X3 },
  { name: "cards", icon: Layout },
  { name: "footer", icon: PanelBottom },
];

export function Sections() {
  return (
    <section className="w-full px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Branding */}
          <Card variant="bracket">
            <div className="space-y-3">
              <CardDescription className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                BRANDING
              </CardDescription>
              <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                Identity
              </CardTitle>
              <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                Logo, colors, typography, and voice guidelines for the system.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2">
              {branding.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground"
                >
                  <item.icon className="h-3 w-3" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Components */}
          <Card variant="bracket">
            <div className="space-y-3">
              <CardDescription className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                COMPONENTS
              </CardDescription>
              <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                Primitives
              </CardTitle>
              <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                shadcn/ui components customized with syner tokens and variants.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2">
              {components.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between font-mono text-[9px]"
                >
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="text-muted-foreground/50">
                    [{item.count}]
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Patterns */}
          <Card variant="bracket">
            <div className="space-y-3">
              <CardDescription className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                PATTERNS
              </CardDescription>
              <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                Compositions
              </CardTitle>
              <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                Ready-to-use layouts and sections combining primitives.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2">
              {patterns.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground"
                >
                  <item.icon className="h-3 w-3" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
