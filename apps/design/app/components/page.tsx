import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@syner/ui/components/card";
import { Button } from "@syner/ui/components/button";
import Link from "next/link";
import { ArrowRight, Settings, Activity, Database, Zap, Shield, Code } from "lucide-react";

export default function ComponentsPage() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="border-b border-border p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back
          </Link>
          <h1 className="text-sm font-medium">Components</h1>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-6xl space-y-16">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-block rounded border border-border bg-card px-2 py-1 text-xs uppercase tracking-wide text-muted-foreground">
              Primitives
            </div>
            <h1 className="font-pixel text-6xl">Card</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Flexible card primitive with two variants: default for content, bracket for showcases. Only variants, no new components.
            </p>
          </div>

          {/* Bracket Variant */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Bracket Variant</h2>
              <p className="text-muted-foreground">
                Minimal cards with corner brackets. Terminal-inspired aesthetic for feature showcases.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">With Action Link</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card variant="bracket">
                  <div className="space-y-3">
                    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
                      AUTHENTICATION
                    </CardDescription>
                    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                      Secure by default.
                    </CardTitle>
                    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                      Session-based auth with social logins, magic links, and role-based access out of the box.
                    </CardDescription>
                  </div>
                  <a href="#auth" className="text-[9px] font-medium text-foreground flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                    View docs
                    <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                </Card>

                <Card variant="bracket">
                  <div className="space-y-3">
                    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
                      PAYMENTS
                    </CardDescription>
                    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                      Get paid globally.
                    </CardTitle>
                    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                      Subscriptions, one-time payments, and usage-based billing with zero config.
                    </CardDescription>
                  </div>
                  <a href="#payments" className="text-[9px] font-medium text-foreground flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                    Integrate
                    <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                </Card>

                <Card variant="bracket">
                  <div className="space-y-3">
                    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
                      DATABASE
                    </CardDescription>
                    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                      Query anything.
                    </CardTitle>
                    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                      Postgres with Drizzle ORM. Type-safe queries out of the box.
                    </CardDescription>
                  </div>
                  <a href="#database" className="text-[9px] font-medium text-foreground flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                    Explore
                    <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                  {/* Decorative circle */}
                  <div className="absolute top-6 right-6 size-2 rounded-full border border-border bg-background transition-transform duration-200 delay-100 group-hover:scale-110" />
                </Card>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">Without Action (Info Only)</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <Card variant="bracket">
                  <div className="space-y-3">
                    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
                      TYPESCRIPT
                    </CardDescription>
                    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                      Type-safe.
                    </CardTitle>
                    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                      End-to-end type safety from database to frontend.
                    </CardDescription>
                  </div>
                </Card>

                <Card variant="bracket">
                  <div className="space-y-3">
                    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
                      PERFORMANCE
                    </CardDescription>
                    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                      Blazing fast.
                    </CardTitle>
                    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                      Optimized for speed with edge functions and caching.
                    </CardDescription>
                  </div>
                </Card>

                <Card variant="bracket">
                  <div className="space-y-3">
                    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
                      DEVELOPER UX
                    </CardDescription>
                    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                      Joy to build.
                    </CardTitle>
                    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                      Intuitive APIs and great documentation.
                    </CardDescription>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">With Custom Content (Icons List)</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Card variant="bracket">
                  <div className="space-y-3">
                    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
                      FEATURES
                    </CardDescription>
                    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                      Everything included.
                    </CardTitle>
                    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                      All the tools you need to build modern applications.
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>authentication</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground">
                      <Database className="h-3 w-3" />
                      <span>database</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground">
                      <Zap className="h-3 w-3" />
                      <span>real-time</span>
                    </div>
                  </div>
                </Card>

                <Card variant="bracket">
                  <div className="space-y-3">
                    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
                      STACK
                    </CardDescription>
                    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                      Modern tools.
                    </CardTitle>
                    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                      Built with the latest and greatest technologies.
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { name: "next.js", version: "15" },
                      { name: "react", version: "19" },
                      { name: "tailwind", version: "4" },
                    ].map((tech) => (
                      <div
                        key={tech.name}
                        className="flex items-center justify-between font-mono text-[9px]"
                      >
                        <span className="text-muted-foreground">{tech.name}</span>
                        <span className="text-muted-foreground/50">v{tech.version}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">With Decorative Circle</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Card variant="bracket">
                  <div className="space-y-3">
                    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
                      STORAGE
                    </CardDescription>
                    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                      Files made simple.
                    </CardTitle>
                    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                      Upload, store, and serve files with built-in CDN and image optimization.
                    </CardDescription>
                  </div>
                  <a href="#storage" className="text-[9px] font-medium text-foreground flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                    Learn more
                    <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                  <div className="absolute top-6 right-6 size-2 rounded-full border border-border bg-background transition-transform duration-200 delay-100 group-hover:scale-110" />
                </Card>

                <Card variant="bracket">
                  <div className="space-y-3">
                    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
                      ANALYTICS
                    </CardDescription>
                    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
                      Know your users.
                    </CardTitle>
                    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
                      Privacy-first analytics with real-time insights and custom events.
                    </CardDescription>
                  </div>
                  <a href="#analytics" className="text-[9px] font-medium text-foreground flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                    View demo
                    <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                  <div className="absolute top-6 right-6 size-2 rounded-full border border-border bg-background transition-transform duration-200 delay-100 group-hover:scale-110" />
                </Card>
              </div>
            </div>

            {/* Code example */}
            <div className="space-y-4 border-t border-border pt-8">
              <h3 className="text-lg font-medium">Usage</h3>
              <pre className="rounded border border-border bg-card p-6 font-mono text-xs overflow-x-auto">
{`import { Card, CardTitle, CardDescription } from "@syner/ui/components/card";
import { ArrowRight } from "lucide-react";

<Card variant="bracket">
  <div className="space-y-3">
    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
      LABEL
    </CardDescription>
    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
      Title text
    </CardTitle>
    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
      Description text
    </CardDescription>
  </div>
  <a href="/path" className="text-[9px] font-medium flex items-center gap-1.5">
    Action <ArrowRight size={10} />
  </a>
</Card>`}
              </pre>
            </div>
          </section>

          {/* Standard Variant */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Standard Variant</h2>
              <p className="text-muted-foreground">
                Traditional shadcn/ui card for content blocks, forms, and dashboard widgets.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">With Header, Content, Footer</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your content goes here. This is the standard card variant with rounded corners,
                      background fill, and subtle shadow.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">Save changes</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="text-muted-foreground">• Deployed to production</li>
                      <li className="text-muted-foreground">• Updated environment variables</li>
                      <li className="text-muted-foreground">• Added team member</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">With Action in Header</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Manage system configuration</CardDescription>
                    <CardAction>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Configuration content here. The action button is aligned to the right in the header.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                    <CardDescription>System health</CardDescription>
                    <CardAction>
                      <Button variant="ghost" size="sm">
                        <Activity className="h-4 w-4" />
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="size-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">All systems operational</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">Content Only (No Header)</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Code className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Clean code</p>
                        <p className="text-xs text-muted-foreground">Well structured</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Fast builds</p>
                        <p className="text-xs text-muted-foreground">Optimized output</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Secure</p>
                        <p className="text-xs text-muted-foreground">Best practices</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Code example */}
            <div className="space-y-4 border-t border-border pt-8">
              <h3 className="text-lg font-medium">Usage</h3>
              <pre className="rounded border border-border bg-card p-6 font-mono text-xs overflow-x-auto">
{`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@syner/ui/components/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
