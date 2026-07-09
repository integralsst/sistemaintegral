"use client";

import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, Scale, ShieldCheck, TrendingUp, CheckCircle2, Users } from 'lucide-react';
import { motion, AnimatePresence, Transition, Variants } from 'framer-motion';

// --- Tipado y Datos ---
type ViewMode = 'risk' | 'solution';

// Curva Bezier Premium
const appleEase = [0.16, 1, 0.3, 1] as const;

const baseTransition: Transition = {
  type: "tween",
  ease: appleEase,
  duration: 0.6,
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: baseTransition },
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } }
};

// --- Componente Principal ---
export default function PainPointsInteractive() {
  const [activeView, setActiveView] = useState<ViewMode>('risk');

  // Datos de las vistas
  const contentData = {
    risk: {
      tag: "El costo de la inacción",
      title: "Gestión Deficiente",
      description: "El incumplimiento del SG-SST expone a su organización a riesgos financieros irreversibles. El futuro no debe dejarse al azar.",
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
      themeStyles: {
        bg: "#FFFFFF",
        border: "rgba(220, 38, 38, 0.1)",
        shadow: "0 20px 60px rgba(220, 38, 38, 0.05)",
        textMain: "text-gray-900",
        textSub: "text-gray-500",
        tagBg: "bg-red-50 text-red-600",
      },
      items: [
        { id: "r1", icon: Scale, title: "Sanciones Legales", desc: "Multas severas o cierre temporal del establecimiento.", color: "text-red-500", bg: "bg-red-50/50" },
        { id: "r2", icon: TrendingDown, title: "Sobrecostos ARL", desc: "Incremento exponencial en las tasas de cotización.", color: "text-red-500", bg: "bg-red-50/50" },
        { id: "r3", icon: Users, title: "Demandas", desc: "Exposición ante accidentes o enfermedades laborales.", color: "text-red-500", bg: "bg-red-50/50" }
      ]
    },
    solution: {
      tag: "Blindaje de alta precisión",
      title: "Sistema Integral",
      description: "Asumimos la carga operativa y técnica. Garantizamos la protección de sus empleados y la rentabilidad de su negocio.",
      icon: <ShieldCheck className="w-12 h-12 text-blue-500" />,
      themeStyles: {
        bg: "#09090B", // Dark mode profundo
        border: "rgba(59, 130, 246, 0.15)",
        shadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
        textMain: "text-white",
        textSub: "text-gray-400",
        tagBg: "bg-blue-900/30 text-blue-400",
      },
      items: [
        { id: "s1", icon: CheckCircle2, title: "Cumplimiento 100%", desc: "Auditorías superadas sin hallazgos ni multas.", color: "text-blue-400", bg: "bg-white/5 border-white/5" },
        { id: "s2", icon: TrendingUp, title: "Optimización", desc: "Reducción de ausentismo y máxima productividad.", color: "text-blue-400", bg: "bg-white/5 border-white/5" },
        { id: "s3", icon: ShieldCheck, title: "Tranquilidad", desc: "Delegación total de la responsabilidad técnica.", color: "text-blue-400", bg: "bg-white/5 border-white/5" }
      ]
    }
  };

  const activeContent = contentData[activeView];

  return (
    <section className="w-full py-20 md:py-32 bg-[#F5F5F7] font-sans flex flex-col items-center overflow-hidden">
      
      {/* Cabecera y Segmented Control (iOS Style) */}
      <div className="max-w-3xl w-full mx-auto px-4 text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter mb-8 md:mb-12 leading-[1.05]">
          El verdadero costo de la <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
            Seguridad Laboral.
          </span>
        </h2>

        {/* Switcher Interactivo */}
        <div className="relative inline-flex items-center bg-gray-200/60 p-1.5 rounded-full backdrop-blur-md border border-gray-300/50 shadow-inner">
          {(['risk', 'solution'] as ViewMode[]).map((mode) => {
            const isActive = activeView === mode;
            return (
              <button
                key={mode}
                onClick={() => setActiveView(mode)}
                className={`relative px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-bold rounded-full transition-colors duration-300 z-10 
                  ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-20 flex items-center gap-2">
                  {mode === 'risk' ? (
                     <><AlertTriangle className="w-4 h-4" /> El Problema</>
                  ) : (
                     <><ShieldCheck className="w-4 h-4" /> La Solución</>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ventana Inmersiva Dinámica */}
      <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{
            backgroundColor: activeContent.themeStyles.bg,
            borderColor: activeContent.themeStyles.border,
            boxShadow: activeContent.themeStyles.shadow,
          }}
          transition={{ duration: 0.8, ease: appleEase }}
          className="relative w-full min-h-[550px] md:min-h-[450px] rounded-[2rem] md:rounded-[3rem] border overflow-hidden flex flex-col justify-center p-6 md:p-12 lg:p-16 transform-gpu"
        >
          {/* Textura de Ruido SVG para prevenir banding en Dark Mode */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full flex flex-col lg:flex-row gap-10 lg:gap-16 h-full items-center"
            >
              
              {/* Columna Izquierda: Hero Content */}
              <div className="w-full lg:w-5/12 flex flex-col items-start shrink-0">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 ${activeContent.themeStyles.tagBg}`}>
                  {activeContent.tag}
                </span>
                
                <h3 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.05] ${activeContent.themeStyles.textMain}`}>
                  {activeContent.title}
                </h3>
                
                <p className={`text-lg md:text-xl font-medium leading-relaxed max-w-md ${activeContent.themeStyles.textSub}`}>
                  {activeContent.description}
                </p>
              </div>

              {/* Columna Derecha: The Bento Features */}
              {/* SOLUCIÓN MÓVIL (Snap Scroll): Ocultamos el scrollbar y permitimos deslizar horizontalmente */}
              <div className="w-full lg:w-7/12 mt-4 lg:mt-0">
                <div className="
                  flex lg:grid lg:grid-cols-2 gap-4 md:gap-6 
                  overflow-x-auto lg:overflow-x-visible 
                  snap-x snap-mandatory 
                  pb-6 -mx-6 px-6 lg:mx-0 lg:px-0 lg:pb-0
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                ">
                  {activeContent.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index, ease: appleEase }}
                      className={`
                        w-[85vw] sm:w-[300px] lg:w-full shrink-0 snap-center
                        p-6 md:p-8 rounded-3xl border flex flex-col justify-between
                        transition-all duration-300 transform-gpu
                        ${activeContent.themeStyles.bg === '#FFFFFF' ? 'bg-gray-50 border-gray-100' : 'bg-[#18181B] border-white/5'}
                        ${index === 2 ? 'lg:col-span-2 lg:flex-row lg:items-center lg:gap-8' : ''}
                      `}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 lg:mb-0 shrink-0 ${item.bg}`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div className="flex-grow lg:mt-0">
                        <h4 className={`text-xl font-bold mb-2 tracking-tight ${activeContent.themeStyles.textMain}`}>
                          {item.title}
                        </h4>
                        <p className={`text-sm md:text-base font-medium leading-relaxed ${activeContent.themeStyles.textSub}`}>
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Orbe Decorativo de Fondo - Sigue el color del tema activo */}
          <motion.div
            animate={{
              background: activeView === 'risk' 
                ? 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%)' 
                : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
            }}
            transition={{ duration: 1 }}
            className="absolute -top-1/2 -right-1/4 w-full h-full pointer-events-none transform-gpu blur-[100px]"
          />
        </motion.div>
      </div>
    </section>
  );
}