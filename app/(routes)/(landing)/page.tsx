import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { Stats } from "./_components/stats";
import { Features } from "./_components/features";
import { Footer } from "./_components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
