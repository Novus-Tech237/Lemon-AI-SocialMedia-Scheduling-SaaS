import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { Stats } from "./_components/stats";
import { Features } from "./_components/features";
import { Pricing } from "./_components/pricing";
import { Footer } from "./_components/footer";
import SectionOnePage from "./_components/sections/one";
import SectionTwoPage from "./_components/sections/two";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <SectionOnePage />
        <SectionTwoPage />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
