"use client";

import Hero from "../components/main/Hero";
import Services from "../components/main/Services";
import ProcessSteps from "../components/main/ProcessSteps";
import PainPoints from "../components/main/PainPoints";
import StatsBanner from "../components/main/StatsBanner";
import FaqSection from "../components/main/FaqSection";

export default function Home() {
  return (
    <main className="w-full flex flex-col bg-white">
      <Hero />
      
      <Services />
      
      {/* Nuestra Metodología (Cómo lo hacemos) */}
      <ProcessSteps />
      
      {/* El costo de no actuar (Crear urgencia) */}
      <PainPoints />
      
      {/* Autoridad y números */}
      <StatsBanner />
      
      {/* Resolución de objeciones */}
      <FaqSection />
      
    </main>
  );
}