"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, Variants } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, ChevronRight, CalendarCheck, 
  MessageCircle, FileText, ShieldCheck, TrendingUp, Zap
} from 'lucide-react';
import { ServiceCategory } from '@/app/lib/data/services'; 

interface LayoutProps {
  data: ServiceCategory;
}

// Componente auxiliar para animar elementos cuando entran en pantalla (Efecto Apple)
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
      animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ type: "spring", damping: 20, stiffness: 100, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function DetalleServicioLayout({ data }: LayoutProps) {
  
  // Variantes para listas
  const listContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const listItem: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", damping: 25 } }
  };

  return (
    // Flujo normal del documento, pt-32 asegura que el Smart Navbar no tape nada.
    <main className="w-full bg-white pt-32 pb-24 antialiased selection:bg-blue-200 selection:text-blue-900">
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* NAVEGACIÓN Y TÍTULO PRINCIPAL (Centrado estilo Keynote) */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <Link href="/#servicios" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
              <ArrowLeft size={18} strokeWidth={2.5} />
            </Link>
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <span>Servicios SG-SST</span>
              <span className="text-gray-300">/</span>
              <span className="text-blue-600">{data.title}</span>
            </div>
          </motion.div>

          <Reveal>
            <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black leading-[1.05] tracking-tighter text-gray-950 mb-8">
              {data.title}
            </h1>
          </Reveal>
          
          <Reveal delay={0.1}>
            <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
              {data.description}
            </p>
          </Reveal>
        </div>

        {/* CÁPSULA DE IMAGEN (Sin desproporciones, totalmente responsiva) */}
        <Reveal delay={0.2}>
          <div className="w-full aspect-[16/9] lg:aspect-[21/9] bg-gray-100 rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden mb-24 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200/60 group">
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <Image 
                src={data.bannerImage} 
                alt={data.title} 
                fill 
                className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                quality={100}
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-multiply" />
            </motion.div>
          </div>
        </Reveal>

        {/* GRID DE CONTENIDO (Flujo tradicional con Sticky lateral) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* COLUMNA IZQUIERDA (Alcance y Beneficios) */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Sección: Alcance Técnico */}
            <section>
              <Reveal>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    <Zap size={24} strokeWidth={2} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Alcance Técnico</h2>
                </div>
              </Reveal>

              <motion.div 
                variants={listContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {data.items.map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={listItem}
                    className="p-6 rounded-[1.5rem] bg-[#f5f5f7] border border-white hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group"
                  >
                    <CheckCircle2 size={24} strokeWidth={2.5} className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-700 font-medium leading-relaxed block">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Sección: Impacto Organizacional */}
            <section>
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 tracking-tight">Impacto Organizacional</h2>
              </Reveal>
              
              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, title: "Blindaje Legal Activo", desc: "Su organización operará bajo la estricta alineación del Decreto 1072 y la Resolución 0312, mitigando riesgos de sanciones." },
                  { icon: TrendingUp, title: "Productividad y Continuidad", desc: "Reducción medible del ausentismo mediante la implementación de entornos laborales preventivos y seguros." },
                  { icon: FileText, title: "Trazabilidad Documental", desc: "Generación de soportes, matrices y planes de acción auditables en cualquier momento por entidades reguladoras." }
                ].map((card, idx) => (
                  <Reveal key={idx} delay={idx * 0.1}>
                    <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-shadow duration-500">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <card.icon size={30} strokeWidth={1.5} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{card.title}</h3>
                        <p className="text-lg text-gray-500 leading-relaxed">{card.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA (Panel de Comando Oscuro - Estilo Apple Pro) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 space-y-6">
              
              <Reveal delay={0.3}>
                <div className="bg-[#0a0a0a] rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-gray-800 text-white">
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-gray-300 text-xs font-bold tracking-widest uppercase mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Disponible
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight text-white">
                    Implementar <br/><span className="text-[var(--color-sis-light)]">Solución.</span>
                  </h3>
                  
                  <p className="text-gray-400 mb-10 leading-relaxed">
                    Estructure un SG-SST de alto rendimiento alineado a su modelo de negocio con nuestros especialistas.
                  </p>

                  <div className="space-y-4">
                    <button className="w-full bg-[var(--color-sis-light)] text-black font-bold text-[15px] px-6 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(42,183,246,0.3)]">
                      <CalendarCheck size={20} />
                      Agendar Asesoría
                    </button>
                    
                    <button className="w-full bg-white/5 border border-white/10 text-white font-semibold text-[15px] px-6 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors duration-300">
                      <MessageCircle size={20} />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <button className="w-full bg-gray-50 border border-gray-200 rounded-[2rem] p-6 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3.5 rounded-2xl text-gray-400 group-hover:text-blue-600 shadow-sm border border-gray-100 transition-colors">
                      <FileText size={24} strokeWidth={1.5} />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-gray-900 mb-1">Descargar Brochure</span>
                      <span className="block text-xs text-gray-500 font-medium">PDF Document • 2.4 MB</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              </Reveal>

            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}