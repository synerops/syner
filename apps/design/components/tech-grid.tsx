import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiReact,
} from "@icons-pack/react-simple-icons";

const techs = [
  {
    name: "next.js",
    version: "15",
    icon: SiNextdotjs,
  },
  {
    name: "react",
    version: "19",
    icon: SiReact,
  },
  {
    name: "tailwind",
    version: "4",
    icon: SiTailwindcss,
  },
  {
    name: "typescript",
    version: "5",
    icon: SiTypescript,
  },
  {
    name: "shadcn/ui",
    version: "2",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className="h-6 w-6"
      >
        <rect width="256" height="256" fill="none" />
        <line
          x1="208"
          y1="128"
          x2="128"
          y2="208"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
        <line
          x1="192"
          y1="40"
          x2="40"
          y2="192"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
      </svg>
    ),
  },
];

export function TechGrid() {
  return (
    <section className="w-full border-y border-border px-8 py-12">
      <div className="mx-auto max-w-4xl">
        <p className="mb-8 font-mono text-xs text-muted-foreground">
          {"// stack"}
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {techs.map((tech) => (
            <div key={tech.name} className="flex items-center gap-3">
              <tech.icon className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-mono text-sm">{tech.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  v{tech.version}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
