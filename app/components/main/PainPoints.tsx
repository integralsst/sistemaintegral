"use client";

import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, Scale, ShieldCheck, TrendingUp, CheckCircle2, Users } from 'lucide-react';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';

// --- Tipado Estricto ---
interface ImpactItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

// Curva Bezier (Estándar Apple)
const appleEase = [0.16, 1, 0.3, 1] as const;

const baseTransition: Transition = {
  type: "tween",
  ease: appleEase,
  duration: 0.8,
};

// Variantes de revelación en cascada
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2, ease: appleEase }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    transition: { duration: 0.6, ease: appleEase } 
  }
};

// --- Datos ---
const riskItems: ImpactItem[] = [
  { id: "r1", icon: Scale, title: "Sanciones del Ministerio", description: "Multas severas e incluso el cierre temporal del establecimiento por incumplimiento normativo." },
  { id: "r2", icon: TrendingDown, title: "Sobrecostos en ARL", description: "Incremento exponencial en las tasas de cotización por alta accidentalidad y falta de prevención." },
  { id: "r3", icon: Users, title: "Vulnerabilidad Legal", description: "Exposición inminente a demandas laborales ante accidentes o enfermedades de sus trabajadores." }
];

const solutionItems: ImpactItem[] = [
  { id: "s1", icon: CheckCircle2, title: "Cumplimiento 100%", description: "Blindaje legal absoluto ante auditorías del MinTrabajo y requerimientos técnicos de las ARL." },
  { id: "s2", icon: TrendingUp, title: "Optimización Financiera", description: "Reducción de ausentismo y anulación de multas, protegiendo directamente la rentabilidad." },
  { id: "s3", icon: ShieldCheck, title: "Tranquilidad Gerencial", description: "Delegación total de la carga operativa del SG-SST en tecnología y expertos de alta precisión." }
];

export default function PainPoints() {
  // Estado para la mecánica de Foco Dinámico
  const [hoveredCard, setHoveredCard] = useState<'risk' | 'solution' | null>(null);

  return (
    <section className="w-full py-24 md:py-32 bg-[#FAFAFA] relative z-10 overflow-hidden font-sans flex flex-col items-center">
      
      {/* Cabecera Editorial */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={baseTransition}
          className="text-center max-w-4xl mx-auto transform-gpu"
        >
          <span className="text-red-500 font-bold tracking-widest text-xs md:text-sm uppercase mb-4 block">
            El costo de la inacción
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter mb-6 leading-[0.95]">
            Ignorar la seguridad <br className="hidden md:block"/>
            <span className="text-gray-400">no es una estrategia.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            El incumplimiento del SG-SST expone a su organización a riesgos financieros irreversibles. El futuro de su empresa no debe dejarse al azar.
          </p>
        </motion.div>
      </div>

      {/* Grid de Contraste (Risk vs Solution) */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 relative">
          
          {/* TARJETA 1: RIESGO (Light Mode + Red Accents) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={baseTransition}
            onMouseEnter={() => setHoveredCard('risk')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`
              relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-white border border-red-100/50
              p-8 md:p-12 lg:p-14 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu
              shadow-[0_8px_30px_rgb(220,38,38,0.04)] hover:shadow-[0_20px_60px_rgb(220,38,38,0.08)]
              ${hoveredCard === 'solution' ? 'lg:scale-[0.97] lg:opacity-60 lg:grayscale-[0.5]' : 'lg:scale-100 lg:opacity-100'}
            `}
          >
            {/* Orbe de Riesgo (Efecto ambiental sutil optimizado para GPU) */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 bg-red-100/50 rounded-full blur-[80px] pointer-events-none transform-gpu hidden md:block" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10 md:mb-14">
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">
                  Gestión <br/> Deficiente
                </h3>
              </div>

              <motion.ul 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-8 md:space-y-10"
              >
                {riskItems.map((item) => (
                  <motion.li key={item.id} variants={itemVariants} className="flex gap-5 group/item">
                    <div className="mt-1 shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover/item:bg-red-50 group-hover/item:border-red-200 transition-colors duration-300">
                        <item.icon className="w-5 h-5 text-gray-400 group-hover/item:text-red-500 transition-colors duration-300" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2 tracking-tight group-hover/item:text-red-600 transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          {/* TARJETA 2: SOLUCIÓN (Dark Mode + Blue Accents) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ ...baseTransition, delay: 0.1 }} // Ligero retraso para entrada escalonada
            onMouseEnter={() => setHoveredCard('solution')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`
              relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#0A0A0B] border border-white/10
              p-8 md:p-12 lg:p-14 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu
              shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgb(37,99,235,0.15)]
              ${hoveredCard === 'risk' ? 'lg:scale-[0.97] lg:opacity-60' : 'lg:scale-100 lg:opacity-100'}
            `}
          >
            {/* Textura de Ruido para evitar Banding en Dark Mode (Oculta en móvil) */}
            <div 
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none hidden md:block"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
            
            {/* Orbe de Solución */}
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none transform-gpu hidden md:block" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10 md:mb-14">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                  Sistema <br/> Integral
                </h3>
              </div>

              <motion.ul 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-8 md:space-y-10"
              >
                {solutionItems.map((item) => (
                  <motion.li key={item.id} variants={itemVariants} className="flex gap-5 group/item">
                    <div className="mt-1 shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-blue-600/20 group-hover/item:border-blue-500/30 transition-colors duration-300">
                        <item.icon className="w-5 h-5 text-gray-500 group-hover/item:text-blue-400 transition-colors duration-300" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-100 mb-2 tracking-tight group-hover/item:text-blue-400 transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}