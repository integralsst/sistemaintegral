"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { 
  ArrowRight, 
  FileText,
  ShieldCheck,
  Flame,
  Briefcase
} from "lucide-react";

export default function Services() {
  const serviceCategories = [
    {
      id: "gestion-documental",
      icon: <FileText size={24} />,
      title: "Gestión Documental",
      description: "Estructuración normativa, diseño de políticas, reglamentos y consolidación del SG-SST alineado a la legislación vigente.",
      imagePath: "/images/gestion-documental.webp" 
    },
    {
      id: "gestion-a-la-intervencion",
      icon: <ShieldCheck size={24} />,
      title: "Gestión a la Intervención",
      description: "Ejecución de inspecciones, controles operativos locativos y evaluación continua de riesgos en el entorno de trabajo.",
      imagePath: "/images/intervencion.webp" 
    },
    {
      id: "gestion-a-emergencias",
      icon: <Flame size={24} />,
      title: "Gestión a Emergencias",
      description: "Preparación táctica mediante formación de brigadas, planes de evacuación, simulacros y manejo de contingencias.",
      imagePath: "/images/emergencias.webp" 
    },
    {
      id: "gestion-especializada",
      icon: <Briefcase size={24} />,
      title: "Gestión Especializada",
      description: "Asesoría avanzada en tareas de alto riesgo, riesgo psicosocial, higiene industrial y vigilancia epidemiológica, dirigida a ARL y empresas.",
      imagePath: "/images/especializada.webp" 
    }
  ];

  // Variantes de animación
  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 20 }
    }
  };

  return (
   <section id="servicios" className="w-full pt-16 pb-32 px-4 sm:px-6 lg:px-8 relative z-10 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs tracking-widest uppercase mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Cobertura Nacional
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-5xl sm:text-7xl lg:text-[6rem] font-black leading-[0.95] tracking-tighter text-gray-950 mb-8 max-w-5xl"
        >
          Ecosistema Preventivo. <br className="hidden md:block" />
          <span className="bg-gradient-to-br from-gray-900 via-blue-800 to-blue-500 text-transparent bg-clip-text">
            Elevando el estándar.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl leading-relaxed tracking-tight mb-20"
        >
          Automatice inspecciones, gestione riesgos en tiempo real y blinde su empresa con una arquitectura de seguridad diseñada para la protección absoluta.
        </motion.p>

        <motion.div 
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full text-left"
        >
          {serviceCategories.map((category, index) => (
            <motion.div key={index} variants={cardVariants} className="h-full">
              <Link 
                href={`/servicios/${category.id}`}
                className="group relative bg-[#f8f8fa] border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-100 hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.21,0.47,0.32,0.98)] cursor-pointer h-full"
              >
                
                {/* Contenedor de Imagen con Efecto Parallax Suave */}
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image
                    src={category.imagePath}
                    alt={category.title}
                    fill
                    className="object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-[cubic-bezier(0.21,0.47,0.32,0.98)]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                <div className="p-8 flex flex-col flex-grow bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                      {category.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                      {category.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-500 font-medium text-[15px] leading-relaxed mb-8 flex-grow">
                    {category.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between text-blue-600 font-bold text-[15px]">
                    <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.21,0.47,0.32,0.98)]">
                      Explorar solución
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-500">
                      <ArrowRight size={18} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}