"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowRight, FileText, ShieldCheck, Flame, Briefcase } from "lucide-react";

interface ServiceCategory {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  imagePath: string;
  span: string; 
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "gestion-documental",
    icon: <FileText size={28} strokeWidth={1.5} />,
    title: "Gestión Documental",
    description: "Estructuración normativa, diseño de políticas y consolidación del SG-SST alineado a la legislación vigente de manera impecable.",
    imagePath: "/images/gestion-documental.webp",
    span: "md:col-span-12 lg:col-span-8" // Tarjeta Ancha
  },
  {
    id: "gestion-a-la-intervencion",
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    title: "Intervención Operativa",
    description: "Inspecciones y evaluación continua de riesgos en tiempo real.",
    imagePath: "/images/intervencion.webp",
    span: "md:col-span-12 lg:col-span-4" // Tarjeta Cuadrada
  },
  {
    id: "gestion-a-emergencias",
    icon: <Flame size={28} strokeWidth={1.5} />,
    title: "Gestión a Emergencias",
    description: "Formación táctica de brigadas y simulacros de alta precisión.",
    imagePath: "/images/emergencias.webp",
    span: "md:col-span-12 lg:col-span-4" // Tarjeta Cuadrada
  },
  {
    id: "gestion-especializada",
    icon: <Briefcase size={28} strokeWidth={1.5} />,
    title: "Gestión Especializada",
    description: "Asesoría avanzada en tareas de alto riesgo, riesgo psicosocial, higiene industrial y vigilancia epidemiológica para empresas.",
    imagePath: "/images/especializada.webp",
    span: "md:col-span-12 lg:col-span-8" // Tarjeta Ancha
  }
];

const APPLE_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: APPLE_EASE } }
};

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Efecto Parallax para luces de fondo
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section 
      id="servicios" 
      ref={containerRef}
      // Fondo Apple Light Mode
      className="relative w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#fbfbfd] overflow-hidden font-sans"
    >
      {/* Luces Volumétricas adaptadas para fondo claro */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[120px]" />
      </motion.div>

      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col items-center">

        {/* Encabezado */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center text-center mb-20 w-full"
        >
          <motion.div variants={headerVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/15 text-blue-700 font-semibold text-xs md:text-sm tracking-widest uppercase mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Ecosistema Integral
          </motion.div>

          <motion.h2 
            variants={headerVariants}
            className="text-[#1d1d1f] text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tighter mb-6 max-w-4xl"
          >
            Protección de Alto Nivel.<br />
            {/* Gradiente oscuro/intenso para contrastar con el fondo blanco */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
              Diseñada para Escalar.
            </span>
          </motion.h2>

          <motion.p 
            variants={headerVariants}
            className="text-[#86868b] text-lg md:text-2xl font-normal max-w-2xl leading-relaxed tracking-tight"
          >
            Nuestros módulos especializados cubren cada ángulo del SG-SST, transformando la burocracia en una ventaja competitiva automatizada.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 w-full">
          {serviceCategories.map((category, index) => (
            <motion.div 
              key={category.id} 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: APPLE_EASE }}
              className={`${category.span} group h-[450px] md:h-[500px] will-change-transform`}
            >
              <Link 
                href={`/servicios/${category.id}`}
                // Sombra difusa premium estilo Apple para fondos claros
                className="relative block w-full h-full rounded-[2.5rem] overflow-hidden bg-white border border-black/[0.04] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] hover:border-black/[0.08] transition-all duration-500"
              >
                {/* Capa de Imagen Dinámica */}
                <motion.div 
                  className="absolute inset-0 w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.5, ease: APPLE_EASE }}
                >
                  <Image
                    src={category.imagePath}
                    alt={category.title}
                    fill
                    className="object-cover transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Scrims para asegurar que el texto interior siempre sea legible (blanco sobre oscuro) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent opacity-80" />
                </motion.div>

                {/* Contenido Flotante (Glassmorphism UI adaptado) */}
                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end z-20">
                  <motion.div 
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.5, ease: APPLE_EASE }}
                    className="flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {/* Icono con Glassmorphism */}
                      <div className="p-3 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-white group-hover:bg-white group-hover:text-blue-600 transition-all duration-500 shadow-lg">
                        {category.icon}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                        {category.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-200 font-normal text-base md:text-lg leading-relaxed max-w-lg mb-6 line-clamp-3 drop-shadow-sm">
                      {category.description}
                    </p>

                    {/* Botón Magnético Interactivo */}
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500 shadow-md">
                        <ArrowRight size={18} className="text-white group-hover:text-blue-600 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                      </div>
                      <span className="font-semibold text-white/0 -translate-x-4 group-hover:translate-x-0 group-hover:text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] drop-shadow-md">
                        Explorar solución
                      </span>
                    </div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}