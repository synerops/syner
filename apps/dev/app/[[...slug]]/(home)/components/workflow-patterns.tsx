import Link from "next/link";
import { GitFork, Users, Zap, RotateCcw, ArrowRight } from "lucide-react";

const workflows = [
  {
    icon: GitFork,
    title: "Routing",
    description:
      "Classify input and delegate to specialized agents based on intent.",
    href: "/docs/workflows/routing",
  },
  {
    icon: Users,
    title: "Orchestrator-Workers",
    description:
      "Central agent coordinates multiple workers for complex tasks.",
    href: "/docs/workflows/orchestrator-workers",
  },
  {
    icon: Zap,
    title: "Parallelization",
    description: "Execute independent subtasks concurrently for faster results.",
    href: "/docs/workflows/parallelization",
  },
  {
    icon: RotateCcw,
    title: "Evaluator-Optimizer",
    description:
      "Generate, evaluate, and refine outputs iteratively until quality threshold met.",
    href: "/docs/workflows/evaluator-optimizer",
  },
];

export const WorkflowPatterns = () => (
  <section className="bg-muted/50 px-4 py-16 sm:px-16 sm:py-24">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center font-semibold text-3xl sm:text-4xl">
        Workflow Patterns
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        Built-in patterns from Anthropic&apos;s &quot;Building Effective
        Agents&quot; research.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {workflows.map((workflow) => (
          <Link
            key={workflow.title}
            href={workflow.href}
            className="group flex items-start gap-4 rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent"
          >
            <workflow.icon className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold">{workflow.title}</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                {workflow.description}
              </p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  </section>
);
