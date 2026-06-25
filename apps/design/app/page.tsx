import { Header } from "@syner/ui/components/header";
import { Footer } from "@syner/ui/components/footer";
import { Hero } from "@/components/hero";
import { TechGrid } from "@/components/tech-grid";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header domain="design" githubUrl="https://github.com/synerops/syner" />
      <main className="flex flex-1 flex-col">
        <Hero />
        <TechGrid />
      </main>
      <Footer
        domain="design"
        tagline="Agentic design system — components that agents understand and generate."
        columns={[
          {
            label: "Project",
            links: [
              { label: "GitHub", href: "https://github.com/synerops/syner" },
              { label: "Docs", href: "https://syner.dev" },
            ],
          },
        ]}
      />
    </div>
  );
}
