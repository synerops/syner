import { Logo } from "@syner/ui/branding";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@syner/ui/components/card";
import { Palette, Type, MessageSquare, Blocks, Square, Keyboard, BadgeIcon, Layout, Grid3X3, PanelTop, PanelBottom } from "lucide-react";

const branding = [
  { name: "logo", icon: Logo, isLogo: true },
  { name: "colors", icon: Palette },
  { name: "typography", icon: Type },
  { name: "voice", icon: MessageSquare },
];

const components = [
  { name: "button", count: 6 },
  { name: "card", count: 4 },
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
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Branding */}
          <Card>
            <CardHeader>
              <p className="mb-4 font-mono text-xs text-muted-foreground">
                // branding
              </p>
              <CardTitle className="text-base">Identity</CardTitle>
              <CardDescription className="text-sm">
                Logo, colors, typography, and voice guidelines.
              </CardDescription>
              <div className="mt-4 flex flex-col gap-2">
                {branding.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 font-mono text-xs text-muted-foreground"
                  >
                    {item.isLogo ? (
                      <item.icon className="h-4 w-4" />
                    ) : (
                      <item.icon className="h-4 w-4" />
                    )}
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* Components */}
          <Card>
            <CardHeader>
              <p className="mb-4 font-mono text-xs text-muted-foreground">
                // components
              </p>
              <CardTitle className="text-base">Primitives</CardTitle>
              <CardDescription className="text-sm">
                shadcn/ui components with syner tokens.
              </CardDescription>
              <div className="mt-4 flex flex-col gap-2">
                {components.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between font-mono text-xs"
                  >
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-muted-foreground/50">
                      [{item.count}]
                    </span>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* Patterns */}
          <Card>
            <CardHeader>
              <p className="mb-4 font-mono text-xs text-muted-foreground">
                // patterns
              </p>
              <CardTitle className="text-base">Compositions</CardTitle>
              <CardDescription className="text-sm">
                Ready-to-use layouts and sections.
              </CardDescription>
              <div className="mt-4 flex flex-col gap-2">
                {patterns.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 font-mono text-xs text-muted-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
