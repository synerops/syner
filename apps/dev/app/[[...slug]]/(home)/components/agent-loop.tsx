import { RefreshCw } from "lucide-react";

const steps = [
  {
    label: "Context",
    description: "Read state",
    color: "bg-blue-500",
  },
  {
    label: "Actions",
    description: "Execute tools",
    color: "bg-green-500",
  },
  {
    label: "Checks",
    description: "Validate results",
    color: "bg-amber-500",
  },
];

export const AgentLoop = () => (
  <section className="px-4 py-16 sm:px-16 sm:py-24">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center font-semibold text-3xl sm:text-4xl">
        The Agent Loop
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        Every agent follows the same core pattern: read context, execute
        actions, validate with checks, and iterate.
      </p>
      <div className="relative mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-4 sm:gap-6">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${step.color} text-white font-semibold text-lg`}
              >
                {index + 1}
              </div>
              <div className="mt-3 font-semibold">{step.label}</div>
              <div className="text-muted-foreground text-sm">
                {step.description}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden h-0.5 w-12 bg-border sm:block" />
            )}
          </div>
        ))}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden h-0.5 w-12 bg-border sm:block" />
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/50">
              <RefreshCw className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="mt-3 font-semibold">Iterate</div>
            <div className="text-muted-foreground text-sm">Repeat cycle</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
