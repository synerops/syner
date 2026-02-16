import { ArrowRight } from "lucide-react";

const layers = [
  {
    name: "Protocol",
    description: "Contracts & specs",
    color: "bg-indigo-500/10 border-indigo-500/30",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "SDK",
    description: "Default implementation",
    color: "bg-purple-500/10 border-purple-500/30",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Extensions",
    description: "Vendor replacements",
    color: "bg-pink-500/10 border-pink-500/30",
    textColor: "text-pink-600 dark:text-pink-400",
  },
];

export const Architecture = () => (
  <section className="bg-muted/50 px-4 py-16 sm:px-16 sm:py-24">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center font-semibold text-3xl sm:text-4xl">
        Three-Layer Architecture
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        Protocol defines contracts, SDK provides defaults, extensions enable
        customization.
      </p>
      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-2">
        {layers.map((layer, index) => (
          <div key={layer.name} className="flex items-center gap-2 sm:gap-4">
            <div
              className={`rounded-lg border ${layer.color} px-6 py-4 text-center`}
            >
              <div className={`font-semibold ${layer.textColor}`}>
                {layer.name}
              </div>
              <div className="mt-1 text-muted-foreground text-sm">
                {layer.description}
              </div>
            </div>
            {index < layers.length - 1 && (
              <ArrowRight className="hidden h-5 w-5 text-muted-foreground sm:block" />
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-lg rounded-lg border bg-card p-4">
        <p className="text-center text-muted-foreground text-sm">
          <span className="font-medium text-foreground">Example:</span> The
          protocol defines a sandbox API. The SDK provides a local
          implementation. @syner/vercel replaces it with Vercel&apos;s sandbox.
        </p>
      </div>
    </div>
  </section>
);
