"use client";

import React, { useState, KeyboardEvent } from 'react';
import { Search, PenTool, Users, Activity } from 'lucide-react';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';

// --- Tipado Estricto ---
interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  bgGradient: string;
}

// Curva Bezier para Layout 
const layoutTransition: Transition = {
  type: "tween",
  ease: [0.16, 1, 0.3, 1],
  duration: 0.8,
};

// Variantes para la revelación del texto interior
const textRevealVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: "0%", 
    opacity: 1, 
    transition: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.7 } 
  }
};

const steps: ProcessStep[] = [
  {
    id: "01",
    title: "Diagnóstico Inicial",
    description: "Evaluación milimétrica frente al Decreto 1072 y Resolución 0312. Mapeamos sus vulnerabilidades legales sin fricciones en su operación.",
    icon: Search,
    bgGradient: "from-slate-100 to-slate-200"
  },
  {
    id: "02",
    title: "Diseño Estratégico",
    description: "Arquitectura de matrices de riesgo y políticas corporativas. No usamos plantillas; construimos un blindaje a la medida de su empresa.",
    icon: PenTool,
    bgGradient: "from-blue-50 to-indigo-100"
  },
  {
    id: "03",
    title: "Implementación",
    description: "Despliegue táctico. Capacitamos a su equipo y consolidamos comités operativos (COPASST), transformando la teoría legal en cultura organizacional.",
    icon: Users,
    bgGradient: "from-indigo-50 to-blue-100"
  },
  {
    id: "04",
    title: "Auditoría Continua",
    description: "Monitoreo constante mediante indicadores de alta precisión. Garantizamos la mejora continua y blindamos su empresa ante inspecciones.",
    icon: Activity,
    bgGradient: "from-gray-50 to-slate-200"
  }
];

export default function FluidProcessSteps() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveStep(index);
    }
  };

  return (
    <section className="w-full min-h-[100svh] bg-[#FAFAFA] text-gray-900 py-16 md:py-24 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center justify-center overflow-hidden">
      
      {/* Cabecera */}
      <div className="max-w-[1400px] mx-auto w-full mb-12 md:mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={layoutTransition}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 transform-gpu"
        >
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
              El Sistema <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
                Integral.
              </span>
            </h2>
          </div>
          <p className="text-lg text-gray-500 font-medium max-w-sm leading-relaxed">
            Metodología de alta precisión en 4 fases para la protección legal y operativa de su organización.
          </p>
        </motion.div>
      </div>

      {/* Contenedor Principal */}
      <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row gap-3 md:gap-4 md:h-[70vh] md:min-h-[600px]">
        {steps.map((step, index) => {
          const isActive = activeStep === index;

          return (
            <motion.div
              key={step.id}
              layout
              onClick={() => setActiveStep(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={0}
              role="button"
              aria-expanded={isActive}
              transition={{ layout: layoutTransition }}
              // will-change-transform y transform-gpu fuerzan el hardware acceleration
              className={`
                relative cursor-pointer overflow-hidden rounded-[2rem] md:rounded-[2.5rem]
                bg-gradient-to-br ${step.bgGradient}
                border border-black/[0.04] shadow-inner focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50
                group flex flex-col transition-colors duration-500 transform-gpu will-change-transform
                ${isActive 
                  ? 'flex-[0.7] h-auto min-h-[420px] md:min-h-0' 
                  : 'flex-[0.1] h-[84px] md:h-auto hover:bg-gray-100/50'
                }
              `}
            >
              {/* Header Inactivo (Icono + Badge) */}
              <motion.div 
                layout="position"
                transition={{ layout: layoutTransition }}
                className={`
                  p-5 md:p-8 flex items-center justify-between z-20 shrink-0 transform-gpu
                  ${isActive ? 'flex-row' : 'flex-row md:flex-col md:justify-start md:h-full md:gap-6'}
                `}
              >
                <div className={`
                  flex items-center justify-center rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100
                  transition-all duration-500 ease-out
                  ${isActive ? 'w-12 h-12 md:w-14 md:h-14 opacity-0 absolute pointer-events-none' : 'w-11 h-11 md:w-16 md:h-16 group-hover:scale-105 group-hover:shadow-md opacity-100 relative'}
                `}>
                  <step.icon className={`text-blue-600 ${isActive ? 'w-5 h-5 md:w-6 md:h-6' : 'w-5 h-5 md:w-7 md:h-7'}`} />
                </div>
                
                {!isActive && (
                  <span className="hidden md:block text-2xl font-bold text-gray-400/60 -rotate-90 origin-center whitespace-nowrap mt-12 transition-colors group-hover:text-gray-500/80">
                    Fase {step.id}
                  </span>
                )}
                
                {!isActive && (
                  <div className="md:hidden flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-700">{step.title}</span>
                    <span className="text-sm font-bold text-gray-400">0{index + 1}</span>
                  </div>
                )}
              </motion.div>

              {/* Contenido Expandido */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, filter: "blur(4px)", scale: 0.98 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-0 bottom-0 p-4 md:p-8 z-30 h-full flex flex-col justify-end pointer-events-none transform-gpu"
                  >
                    <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl md:backdrop-blur-2xl border border-white/80 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.06)] h-full flex flex-col md:flex-row gap-6 md:gap-12 w-full max-w-full pointer-events-auto transform-gpu">
                      
                      {/* Textura de Ruido SVG: Oculta en móviles (hidden md:block) para evitar lag de repintado */}
                      <div 
                        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none hidden md:block"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                      />

                      {/* Columna Izquierda: Identidad Numérica */}
                      <div className="relative z-10 flex flex-col justify-between items-start md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200/50 pb-5 md:pb-0 md:pr-12 shrink-0">
                        <div className="w-14 h-14 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 mb-8 hidden md:flex">
                           <step.icon className="w-6 h-6" />
                        </div>
                        
                        <div className="w-full">
                          <span className="text-blue-600 font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-2 block">
                            Fase del Proceso
                          </span>
                          <span className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none -ml-1">
                            {step.id}
                          </span>
                        </div>
                      </div>

                      {/* Columna Derecha: Tipografía */}
                      <div className="relative z-10 flex flex-col justify-end md:w-2/3 h-full">
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                          }}
                          className="flex flex-col h-full justify-between"
                        >
                          <div className="overflow-hidden pb-3 -mb-3 mb-4 md:mb-6 mt-auto">
                            <motion.h3 
                              variants={textRevealVariants}
                              className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.15]"
                            >
                              {step.title}
                            </motion.h3>
                          </div>
                          
                          <motion.div variants={textRevealVariants}>
                            <p className="text-gray-600 text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-xl">
                              {step.description}
                            </p>
                          </motion.div>
                        </motion.div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decoración de Fondo Abstracta (Mix-blend eliminado en móvil para rendimiento) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-10 pointer-events-none md:mix-blend-multiply"
                    style={{
                      background: 'radial-gradient(circle at 70% 30%, rgba(37, 99, 235, 0.10) 0%, transparent 60%)'
                    }}
                  />
                )}
              </AnimatePresence>

            </motion.div>
          );
        })}
      </div>
    </section>
  );
}