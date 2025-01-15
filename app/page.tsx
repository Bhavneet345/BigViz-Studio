"use client";
import dynamic from "next/dynamic";

// Dynamically import components to disable SSR
const Header = dynamic(() => import("../components/header"), { ssr: false });
const Hero = dynamic(() => import("../components/hero"), { ssr: false });
const Features = dynamic(() => import("../components/features"), { ssr: false });
const SampleVisualization = dynamic(() => import("../components/sample-visualization"), { ssr: false });
const CallToAction = dynamic(() => import("../components/cta"), { ssr: false });
const Footer = dynamic(() => import("../components/footer"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Features />
        <SampleVisualization />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
