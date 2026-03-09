import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@syner/ui/components/card";
import { Button } from "@syner/ui/components/button";
import { ArrowRight, Layers, Palette, Blocks, Sparkles } from "lucide-react";

const features = [
  {
    label: "Components",
    title: "Primitives",
    description:
      "shadcn/ui components customized with syner tokens. Dark-native, accessible, composable.",
    icon: Blocks,
    action: "Browse",
  },
  {
    label: "Tokens",
    title: "Identity",
    description:
      "OKLCH colors, Geist typography, 8px spacing grid. Your brand through semantic tokens.",
    icon: Palette,
    action: "Explore",
  },
  {
    label: "Patterns",
    title: "Compositions",
    description:
      "Hero sections, feature cards, tech grids. Patterns that agents can generate.",
    icon: Layers,
    action: "View",
  },
  {
    label: "Agents",
    title: "Generate",
    description:
      "Describe a component in natural language. Agents build it following our patterns.",
    icon: Sparkles,
    action: "Try",
  },
];

export function FeatureCards() {
  return (
    <section className="w-full px-8 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          What's inside
        </p>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col">
              <CardHeader className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <feature.icon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {feature.label}
                  </p>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1 px-0">
                  {feature.action}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
