import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiReact,
} from "@icons-pack/react-simple-icons";

const techs = [
  {
    name: "Next.js",
    label: "Framework",
    icon: SiNextdotjs,
  },
  {
    name: "React 19",
    label: "Library",
    icon: SiReact,
  },
  {
    name: "Tailwind v4",
    label: "Styling",
    icon: SiTailwindcss,
  },
  {
    name: "TypeScript",
    label: "Language",
    icon: SiTypescript,
  },
  {
    name: "shadcn/ui",
    label: "Primitives",
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
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Stack
        </p>
        <div className="grid grid-cols-5 gap-6">
          {techs.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center gap-3 text-center"
            >
              <tech.icon className="h-6 w-6 text-muted-foreground" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium uppercase tracking-wide">
                  {tech.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tech.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
