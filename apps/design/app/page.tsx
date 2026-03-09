import { Hero } from "@/components/hero";
import { TechGrid } from "@/components/tech-grid";
import { FeatureCards } from "@/components/feature-cards";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center">
        <Hero />
        <TechGrid />
        <FeatureCards />
      </main>
      <Footer />
    </div>
  );
}
