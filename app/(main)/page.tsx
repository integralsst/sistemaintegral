"use client";

import Hero from "../components/main/Hero";
import Services from "../components/main/Services";
import StatsBanner from "../components/main/StatsBanner";

export default function Home() {
  return (
    <main className="w-full flex flex-col bg-white">
      <Hero />
      <Services />
      <StatsBanner/>
      
      {/* Aquí podrás ir agregando los futuros componentes, por ejemplo:
      <Testimonials />
      <ContactForm /> 
      */}
    </main>
  );
}