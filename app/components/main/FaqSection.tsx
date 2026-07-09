"use client";

import React, { useState } from 'react';
import { Plus, X, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, Transition } from 'framer-motion';

// --- Tipado Estricto ---
interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

// Curva Bezier Premium (Ultra fluida)
const appleEase = [0.16, 1, 0.3, 1] as const;

const layoutTransition: Transition = {
  type: "tween",
  ease: appleEase,
  duration: 0.7,
};

// --- Datos ---
const faqs = [
  {
    question: "¿Aplica la normativa del SG-SST para mi empresa si somos menos de 10 empleados?",
    answer: "Absolutamente. La Resolución 0312 establece que el SG-SST es obligatorio para todo empleador en Colombia, sin importar el tamaño. Lo que cambia es la cantidad de estándares a cumplir, aplicando un modelo proporcional a su nivel de riesgo y número de trabajadores."
  },
  {
    question: "¿Qué soportes legales debo tener para las capacitaciones de mi personal?",
    answer: "El Decreto 1072 exige mantener soportes documentales inalterables (firmas, registros de asistencia, evaluaciones) que evidencien la inducción, reinducción y capacitación específica. Sin estos registros, ante el Ministerio, la capacitación nunca existió."
  },
  {
    question: "¿Cuánto tiempo toma diseñar e implementar el sistema desde cero?",
    answer: "El diseño documental y diagnóstico inicial de alta precisión toma entre 4 y 6 semanas. A partir de ahí, desplegamos un plan de trabajo anual de ejecución iterativa, integrándose a su operación sin detener la productividad de su empresa."
  },
  {
    question: "¿Qué pasa si el Ministerio de Trabajo me visita y no tengo el sistema actualizado?",
    answer: "Se expone a un riesgo financiero crítico. Las sanciones van desde multas acumulativas (que pueden superar los 500 SMMLV) hasta el cierre temporal o definitivo de su operación por incumplimiento grave de la normatividad vigente."
  },
  {
    question: "¿Ustedes representan a mi empresa ante la ARL?",
    answer: "Sí. Actuamos como su escudo técnico y legal. Gestionamos reportes, radicaciones y auditorías directamente con su Administradora de Riesgos Laborales, garantizando que usted reciba el 100% de la cobertura y beneficios."
  }
];

// --- Componente: Isla de Enfoque (FaqIsland) ---
const FaqIsland = ({ question, answer, isOpen, isDimmed, onClick }: FaqItemProps) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      // Físicas del Spotlight: Si hay otro abierto, este se atenúa y se va al fondo.
      animate={{
        scale: isOpen ? 1 : isDimmed ? 0.96 : 1,
        opacity: isDimmed ? 0.4 : 1,
        filter: isDimmed ? "blur(3px)" : "blur(0px)",
        backgroundColor: isOpen ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
        borderColor: isOpen ? "rgba(37, 99, 235, 0.2)" : "rgba(0, 0, 0, 0.05)",
      }}
      transition={layoutTransition}
      className={`
        relative w-full cursor-pointer overflow-hidden rounded-[2rem] border transform-gpu
        ${isOpen ? 'shadow-[0_20px_60px_rgba(0,0,0,0.06)] z-20' : 'shadow-sm hover:bg-white hover:shadow-md z-10'}
      `}
    >
      <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-6">
          <motion.h3 
            layout="position"
            className={`text-xl md:text-2xl font-bold tracking-tight leading-snug transition-colors duration-500 mt-1
              ${isOpen ? 'text-gray-900' : 'text-gray-700'}
            `}
          >
            {question}
          </motion.h3>
          
          {/* Botón de acción integrado con morphing */}
          <motion.div 
            layout="position"
            animate={{ 
              rotate: isOpen ? 90 : 0,
              backgroundColor: isOpen ? 'rgb(37, 99, 235)' : 'rgb(243, 244, 246)',
              color: isOpen ? 'rgb(255, 255, 255)' : 'rgb(107, 114, 128)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="close" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                  <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                  <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Expansión del Contenido */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
              transition={{ duration: 0.6, ease: appleEase }}
              className="overflow-hidden transform-gpu"
            >
              <div className="pt-6 md:pt-8 pr-4 md:pr-16">
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
                  {answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- Componente Principal ---
export default function DisruptiveFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Calcula si hay alguna tarjeta abierta para activar el modo Spotlight
  const isAnyActive = openIndex !== null;

  return (
    <section className="w-full min-h-[100svh] py-24 md:py-32 bg-[#F5F5F7] font-sans flex flex-col items-center relative overflow-hidden">
      
      {/* Cabecera Minimalista */}
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 text-center mb-16 md:mb-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={layoutTransition}
        >
          <span className="text-blue-600 font-bold tracking-widest text-xs md:text-sm uppercase mb-6 block">
            Claridad Absoluta
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[0.95] mb-8">
            Respuestas. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
              Sin burocracia.
            </span>
          </h2>
        </motion.div>
      </div>

      {/* Contenedor de las Islas (Spotlight Layout) */}
      <div className="max-w-[900px] w-full mx-auto px-4 sm:px-6 relative z-10">
        {/* Layout de Framer Motion asegura que las tarjetas se empujen orgánicamente */}
        <motion.div layout className="flex flex-col gap-4 md:gap-6">
          {faqs.map((faq, index) => (
            <FaqIsland
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              isDimmed={isAnyActive && openIndex !== index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        {/* CTA Dinámico Inferior (Reemplaza la aburrida tarjeta lateral) */}
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...layoutTransition, delay: 0.4 }}
          className="mt-16 md:mt-24"
        >
          <div className="bg-[#0A0A0B] rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                <MessageCircle className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-1">¿Un caso particular?</h3>
                <p className="text-gray-400 font-medium text-sm md:text-base">Nuestros especialistas legales están listos.</p>
              </div>
            </div>
            
            <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-gray-900 font-bold text-base px-8 py-4 rounded-full hover:bg-gray-100 transition-colors transform-gpu active:scale-95">
              Hablar con un experto
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

    </section>
  );
}