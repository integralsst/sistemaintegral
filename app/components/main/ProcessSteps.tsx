"use client";

import React from 'react';
import { Search, PenTool, Users, Activity } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export default function ProcessSteps() {
  const steps = [
    {
      id: "01",
      title: "Diagnóstico Inicial",
      description: "Realizamos una auditoría profunda de su estado actual frente a la normativa legal vigente (Decreto 1072 y Resolución 0312).",
      icon: <Search size={24} className="text-blue-600" />
    },
    {
      id: "02",
      title: "Diseño y Planificación",
      description: "Estructuramos las matrices de riesgo, políticas y planes de trabajo anuales adaptados específicamente a la realidad de su empresa.",
      icon: <PenTool size={24} className="text-blue-600" />
    },
    {
      id: "03",
      title: "Implementación",
      description: "Ejecutamos capacitaciones, conformamos comités (COPASST/Convivencia) y ponemos en marcha los controles operativos.",
      icon: <Users size={24} className="text-blue-600" />
    },
    {
      id: "04",
      title: "Auditoría y Mejora",
      description: "Medimos resultados mediante indicadores, realizamos auditorías internas y aseguramos la mejora continua de su sistema.",
      icon: <Activity size={24} className="text-blue-600" />
    }
  ];

  // Variantes para la animación en cascada (Stagger) con el tipado de TypeScript
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <section className="w-full py-24 bg-white relative z-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera Animada */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <span className="text-sm font-bold tracking-widest uppercase text-blue-600 block mb-4">
            Nuestra Metodología
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            De la evaluación a la tranquilidad total.
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            Un proceso estructurado de 4 fases para garantizar que su empresa cumpla con la ley y proteja a sus colaboradores sin sobrecargar su operación.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 relative"
        >
          {/* Línea conectora animada (se dibuja sola) */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            style={{ transformOrigin: "left" }}
            className="hidden xl:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-100 z-0"
          ></motion.div>

          {steps.map((step, index) => (
            <motion.div key={index} variants={cardVariants} className="relative z-10 flex flex-col group">
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-2">
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-gray-100 group-hover:text-blue-100 transition-colors duration-300">
                    {step.id}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                  {step.title}
                </h3>
                
                <p className="text-gray-500 text-[15px] leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}