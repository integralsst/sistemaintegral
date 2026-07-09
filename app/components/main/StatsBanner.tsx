"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView, Variants } from 'framer-motion';
import { BookOpen, Building2, ShieldCheck, Activity } from 'lucide-react';

// ----------------------------------------------------------------------
// 1. ANIMATED COUNTER (Motor de números a 60fps con Apple Ease)
// ----------------------------------------------------------------------
const AnimatedCounter = ({ target, suffix = "", prefix = "" }: { target: number, suffix?: string, prefix?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useTransform(rounded, (latest) => 
    Intl.NumberFormat('es-CO').format(latest)
  );

  useEffect(() => {
    if (isInView) {
      animate(count, target, {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Apple Spring Ease
      });
    }
  }, [isInView, target, count]);

  return (
    <div ref={ref} className="flex items-baseline justify-center font-black tracking-tighter text-5xl md:text-6xl lg:text-[5rem] mb-4">
      {prefix && <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mr-1">{prefix}</span>}
      <motion.span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40">
        {display}
      </motion.span>
      {suffix && <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 ml-1">{suffix}</span>}
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. MAIN COMPONENT: STATS BANNER
// ----------------------------------------------------------------------
export default function StatsBanner() {
  const stats = [
    {
      icon: <BookOpen size={28} strokeWidth={2} />,
      target: 15000,
      prefix: "+",
      label: "Capacitaciones",
      description: "Horas de formación certificadas",
      color: "from-blue-500/20 to-cyan-500/5",
      iconColor: "text-cyan-400"
    },
    {
      icon: <Building2 size={28} strokeWidth={2} />,
      target: 30000,
      prefix: "+",
      label: "Empresas",
      description: "Cobertura estratégica a nivel nacional",
      color: "from-[var(--color-sis-light)]/20 to-blue-600/5",
      iconColor: "text-[var(--color-sis-light)]"
    },
    {
      icon: <ShieldCheck size={28} strokeWidth={2} />,
      target: 100,
      suffix: "%",
      label: "Cumplimiento",
      description: "Auditorías legales superadas con éxito",
      color: "from-indigo-500/20 to-purple-500/5",
      iconColor: "text-indigo-400"
    }
  ];

  // Variantes estrictas para TypeScript
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
    }
  };

  return (
    <section className="relative w-full bg-[#050505] py-24 md:py-32 overflow-hidden selection:bg-blue-500/30">
      
      {/* --- FONDOS Y TEXTURAS (Efecto Wow) --- */}
      {/* 1. Orbe magnético central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/15 blur-[120px] rounded-[100%] pointer-events-none" />
      
      {/* 2. Grid arquitectónico sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* --- CONTENIDO --- */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Encabezado del Banner */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold tracking-widest uppercase mb-6 shadow-xl backdrop-blur-md"
          >
            <Activity size={14} className="text-blue-400" />
            Impacto Comprobado
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-2xl"
          >
            Números que respaldan nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[var(--color-sis-light)]">excelencia operativa.</span>
          </motion.h2>
        </div>

        {/* Grid de Tarjetas (Bento-style horizontal) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group rounded-[2.5rem] p-[1px] overflow-hidden bg-gradient-to-b from-white/10 to-transparent transition-all duration-500"
            >
              {/* Resplandor interno dinámico al hacer hover */}
              <div className="absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
              
              {/* Contenedor principal de la tarjeta */}
              <div className="relative z-10 h-full w-full bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center text-center shadow-2xl">
                
                {/* Ícono envuelto en cápsula luminosa */}
                <div className={`mb-8 p-4 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out`}>
                  <div className={stat.iconColor}>
                    {stat.icon}
                  </div>
                </div>

                {/* Motor numérico */}
                <AnimatedCounter target={stat.target} suffix={stat.suffix} prefix={stat.prefix} />
                
                <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight mb-3">
                  {stat.label}
                </h3>
                <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-[250px] mx-auto">
                  {stat.description}
                </p>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}