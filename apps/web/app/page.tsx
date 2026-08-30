"use client"

// Client component: several shadcn base-nova primitives (Badge, Item,
// ButtonGroup) call Base UI's useRender hook without shipping a
// "use client" directive of their own, so they only work inside a client
// boundary. Marking the page keeps those registry files untouched.

import { CheckCircle, Info, Warning } from "@phosphor-icons/react"

import { Avatar, AvatarFallback } from "@syner/ui/components/avatar"
import { Badge } from "@syner/ui/components/badge"
import { Button } from "@syner/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@syner/ui/components/card"
import { Checkbox } from "@syner/ui/components/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@syner/ui/components/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@syner/ui/components/field"
import { Input } from "@syner/ui/components/input"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@syner/ui/components/item"
import { Kbd, KbdGroup } from "@syner/ui/components/kbd"
import { Progress, ProgressLabel, ProgressValue } from "@syner/ui/components/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@syner/ui/components/select"
import { Separator } from "@syner/ui/components/separator"
import { Skeleton } from "@syner/ui/components/skeleton"
import { Spinner } from "@syner/ui/components/spinner"
import { Switch } from "@syner/ui/components/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@syner/ui/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@syner/ui/components/tabs"
import { Textarea } from "@syner/ui/components/textarea"

// Every value on this page is real state of the repo on 2026-08-26.
// Headings carry `font-heading` (Cal Sans); everything else inherits Inter.

const workspace = [
  { name: "web", path: "apps/web", role: "Next.js 16.3.3 app", state: "active" },
  { name: "@syner/ui", path: "packages/ui", role: "shadcn design system", state: "active" },
  { name: "syner", path: "packages/syner", role: "orchestrator agent", state: "feb-2026" },
  { name: "@syner/mcp", path: "packages/mcp", role: "MCP server", state: "feb-2026" },
  { name: "@syner/sdk", path: "packages/sdk", role: "agent SDK", state: "feb-2026" },
]

const commits = [
  { sha: "f9c7cad", message: "feat(web): apps/web on Next 16 + packages/ui rebuilt on coss" },
  { sha: "8c452a7", message: "docs: reset README to logo + tagline" },
  { sha: "74965c5", message: "chore: strip syner down to core" },
]

const status = [
  {
    icon: CheckCircle,
    title: "web builds",
    body: "next build passes on Next 16.3.3 with Turbopack; / renders static.",
    tone: "text-emerald-600 dark:text-emerald-400",
    badge: "passing",
  },
  {
    icon: Warning,
    title: "Paper Mono license unverified",
    body: "The file comes from cosscom/coss. Confirm the license before shipping it.",
    tone: "text-amber-600 dark:text-amber-400",
    badge: "blocked",
  },
  {
    icon: Info,
    title: "Fonts are a temporary patch",
    body: "Cal Sans and Paper Mono are wired in apps/web/app/layout.tsx only.",
    tone: "text-muted-foreground",
    badge: "pending",
  },
]

const tickets = {
  done: [
    "SYN-153",
    "SYN-154",
    "SYN-155",
    "SYN-156",
    "SYN-159",
    "SYN-160",
    "SYN-161",
    "SYN-162",
    "SYN-163",
    "SYN-164",
    "SYN-165",
  ],
  open: ["SYN-152", "SYN-157", "SYN-158"],
}

const projects = ["Syner", "syner.dev", "syner.app", "syner.run"]

const doneRatio = Math.round(
  (tickets.done.length / (tickets.done.length + tickets.open.length)) * 100
)

function Section({
  id,
  title,
  hint,
  children,
}: {
  id: string
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex scroll-mt-20 flex-col gap-4" id={id}>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading font-semibold text-xl tracking-tight">{title}</h2>
        {hint ? <p className="text-muted-foreground text-sm">{hint}</p> : null}
      </div>
      {children}
    </section>
  )
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 py-10">
      <Section
        hint="Cal Sans for headings, Inter for body and UI, Paper Mono for code. 13px base."
        id="type-scale"
        title="Type scale"
      >
        <Card>
          <CardContent className="flex flex-col gap-4">
            <p className="font-heading font-semibold text-4xl tracking-tight">
              Create apps that work together.
            </p>
            <p className="font-heading font-semibold text-2xl tracking-tight">
              Create apps that work together.
            </p>
            <p className="font-medium text-lg">Create apps that work together.</p>
            <Separator />
            <p className="text-base">
              Body · Inter 400 — The quick brown fox jumps over the lazy dog. 0123456789.{" "}
              <em>Italic.</em> <strong>Bold 700.</strong>
            </p>
            <p className="text-muted-foreground text-sm">
              Small muted, with inline{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                @syner/ui/components/button
              </code>{" "}
              and <Kbd>⌘K</Kbd>.
            </p>
          </CardContent>
        </Card>
      </Section>

      <Section hint="Three facts about this repo right now." id="status" title="Status">
        <div className="flex flex-col gap-2">
          {status.map((s) => (
            <Item key={s.title} variant="outline">
              <ItemMedia>
                <s.icon className={`size-5 ${s.tone}`} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{s.title}</ItemTitle>
                <ItemDescription>{s.body}</ItemDescription>
              </ItemContent>
              <Badge variant="secondary">{s.badge}</Badge>
            </Item>
          ))}
        </div>
      </Section>

      <Section
        hint="SYN-152 to SYN-165, project Syner. The form mirrors the rules the PreToolUse hook enforces."
        id="tickets"
        title="Tickets"
      >
        <div className="grid items-start gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today</CardTitle>
              <CardDescription>
                {tickets.done.length} done · {tickets.open.length} open
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Progress value={doneRatio}>
                <ProgressLabel>Closed</ProgressLabel>
                <ProgressValue className="ml-auto text-muted-foreground" />
              </Progress>
              <div className="flex flex-wrap gap-1.5">
                {tickets.open.map((id) => (
                  <Badge key={id} variant="default">
                    {id}
                  </Badge>
                ))}
                {tickets.done.map((id) => (
                  <Badge key={id} variant="outline">
                    {id}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New ticket</CardTitle>
              <CardDescription>Blocked unless it reads in 20 seconds.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input id="title" placeholder="≤ 10 words, declarative" />
                  <FieldDescription>No feat(x): or [Tag] prefix.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="project">Project</FieldLabel>
                  <Select defaultValue="Syner">
                    <SelectTrigger id="project">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="body">Description</FieldLabel>
                  <Textarea
                    id="body"
                    placeholder="≤ 6 lines, paths in backticks, one imperative line"
                    rows={3}
                  />
                </Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-2 font-normal">
                    <Checkbox defaultChecked /> Backlog
                  </FieldLabel>
                  <FieldLabel className="flex items-center gap-2 font-normal">
                    Notify <Switch />
                  </FieldLabel>
                </div>
              </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost">Cancel</Button>
              <Dialog>
                <DialogTrigger render={<Button />}>Create</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ticket format</DialogTitle>
                    <DialogDescription>
                      Enforced by a PreToolUse hook, not by convention.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-2 text-sm">
                    <p>Title ≤ 10 words. Title + description ≤ 70 words.</p>
                    <p>Description ≤ 6 lines. Paths in backticks.</p>
                    <p>One line starts with an imperative verb.</p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Section
        hint="The page sits on a soft gray; cards and popovers step up toward white without reaching it."
        id="surfaces"
        title="Surfaces"
      >
        <Card>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {[
              { name: "background", swatch: "bg-background", note: "page and sidebar" },
              { name: "card", swatch: "bg-card", note: "raised containers" },
              { name: "muted", swatch: "bg-muted", note: "inset wells" },
            ].map((s) => (
              <div className="flex flex-col gap-2" key={s.name}>
                <div className={`h-16 rounded-lg border ${s.swatch}`} />
                <div className="flex flex-col">
                  <span className="font-mono text-xs">--{s.name}</span>
                  <span className="text-muted-foreground text-xs">{s.note}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      <Section hint="Five packages, three commits today." id="workspace" title="Workspace">
        <Tabs defaultValue="packages">
          <TabsList>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="commits">Commits</TabsTrigger>
          </TabsList>
          <TabsContent value="packages">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">State</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workspace.map((p) => (
                    <TableRow key={p.name}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="font-mono text-xs">{p.path}</TableCell>
                      <TableCell className="text-muted-foreground">{p.role}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={p.state === "active" ? "secondary" : "outline"}>
                          {p.state}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="commits">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SHA</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commits.map((c) => (
                    <TableRow key={c.sha}>
                      <TableCell className="font-mono text-xs">{c.sha}</TableCell>
                      <TableCell className="text-muted-foreground">{c.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Section hint="Six variants, eight sizes." id="buttons" title="Buttons">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <Separator />
            <div className="flex flex-wrap items-center gap-2">
              <Button size="xs">xs</Button>
              <Button size="sm">sm</Button>
              <Button>default</Button>
              <Button size="lg">lg</Button>
              <Button disabled>
                <Spinner data-icon="inline-start" />
                Working
              </Button>
              <Button disabled variant="outline">
                Disabled
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section hint="Everything else, at rest." id="bits" title="Bits">
        <Card>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar>
                <AvatarFallback>RB</AvatarFallback>
              </Avatar>
              <Spinner />
              <Skeleton className="h-8 w-40" />
              <Separator className="h-8" orientation="vertical" />
              <Badge>default</Badge>
              <Badge variant="secondary">secondary</Badge>
              <Badge variant="outline">outline</Badge>
              <Badge variant="destructive">destructive</Badge>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </div>
            <pre className="overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm">
              <code>{`bunx --bun shadcn@latest add sidebar   # lands in packages/ui`}</code>
            </pre>
          </CardContent>
        </Card>
      </Section>
    </main>
  )
}
