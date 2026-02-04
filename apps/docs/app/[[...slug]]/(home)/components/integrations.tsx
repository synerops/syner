import { ExternalLink } from "lucide-react";

export const Integrations = () => (
  <section className="px-4 py-16 sm:px-16 sm:py-24">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center font-semibold text-3xl sm:text-4xl">
        Integrations
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        Vendors extend Syner OS by implementing protocol contracts.
      </p>
      <div className="mx-auto mt-12 max-w-2xl">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 76 65"
                fill="currentColor"
              >
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">@syner/vercel</h3>
              <p className="text-muted-foreground text-sm">
                Vercel sandbox integration
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-md bg-muted p-4">
            <p className="text-sm">
              <span className="font-medium text-foreground">
                What it provides:
              </span>{" "}
              <span className="text-muted-foreground">
                Secure code execution in Vercel&apos;s isolated sandbox
                environment. Replaces the SDK&apos;s default local sandbox with
                cloud-based execution.
              </span>
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://github.com/synerops/syner/tree/main/extensions/vercel"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-primary text-sm hover:underline"
            >
              View source
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
