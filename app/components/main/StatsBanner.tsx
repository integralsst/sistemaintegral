"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { BookOpen, Building2, ShieldCheck } from 'lucide-react';

// Subcomponente animado nativo de Framer Motion
const AnimatedCounter = ({ target, suffix = "", prefix = "" }: { target: number, suffix?: string, prefix?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useTransform(rounded, (latest) => 
    Intl.NumberFormat('en-US').format(latest)
  );

  useEffect(() => {
    if (isInView) {
      animate(count, target, {
        duration: 2.5,
        ease: [0.21, 0.47, 0.32, 0.98], // Curva de desaceleración tipo Apple
      });
    }
  }, [isInView, target, count]);

  return (
    <div ref={ref} className="flex items-baseline justify-center font-black text-white tracking-tighter text-5xl md:text-6xl lg:text-7xl mb-2">
      {prefix && <span>{prefix}</span>}
      <motion.span>{display}</motion.span>
      {suffix && <span>{suffix}</span>}
    </div>
  );
};

export default function StatsBanner() {
  const stats = [
    {
      icon: <BookOpen size={32} strokeWidth={1.5} />,
      target: 15000,
      prefix: "+",
      label: "Capacitaciones realizadas",
      description: "Horas de formación certificadas"
    },
    {
      icon: <Building2 size={32} strokeWidth={1.5} />,
      target: 30000,
      prefix: "+",
      label: "Empresas asesoradas",
      description: "A nivel nacional"
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      target: 100,
      suffix: "%",
      label: "Cumplimiento legal",
      description: "Auditorías superadas con éxito"
    }
  ];

  return (
    <section className="w-full bg-gray-950 py-24 md:py-32 relative overflow-hidden">
      
      {/* Aura / Resplandor de fondo (Súper Premium) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Patrón de puntos sutil para textura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0 md:divide-x divide-gray-800 text-center">
          
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
              className="flex flex-col items-center justify-center group"
            >
              {/* Ícono animado */}
              <div className="mb-6 p-4 rounded-2xl bg-gray-900 border border-gray-800 text-blue-500 shadow-lg shadow-blue-900/20 group-hover:scale-110 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-all duration-500">
                {stat.icon}
              </div>

              {/* Contador */}
              <AnimatedCounter target={stat.target} suffix={stat.suffix} prefix={stat.prefix} />
              
              {/* Textos */}
              <h3 className="text-gray-300 text-xl font-bold tracking-tight mb-1">
                {stat.label}
              </h3>
              <p className="text-gray-500 text-sm font-medium">
                {stat.description}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}