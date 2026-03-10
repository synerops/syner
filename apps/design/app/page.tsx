import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Sections } from "@/components/sections";
import { TechGrid } from "@/components/tech-grid";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Sections />
        <TechGrid />
      </main>
      <Footer />
    </div>
  );
}
