import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import DashboardPreview from "@/components/dashboard-preview";
import Stats from "@/components/stats";
import Creator from "@/components/creator";
import CTA from "@/components/cta";
import Footer from "@/components/footer";
import ParticleField from "@/components/particle-field";
import ParallaxOrbs from "@/components/parallax-orbs";

export default function Home() {
  return (
    <>
      <ParticleField />
      <ParallaxOrbs />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <div className="relative z-10">
        <Navbar />
        <main id="main">
          <Hero />
          <Features />
          <HowItWorks />
          <DashboardPreview />
          <Stats />
          <Creator />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
