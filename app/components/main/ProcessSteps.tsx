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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 15, mass: 1 }
    }
  };

  return (
    <section className="w-full py-24 md:py-32 bg-white relative z-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera Animada con efecto cinematográfico */}
        <motion.div 
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-28"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-blue-600 block mb-4">
            Nuestra Metodología
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-[1.1]">
            De la evaluación a la tranquilidad total.
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
            Un proceso estructurado de 4 fases para garantizar que su empresa cumpla con la ley y proteja a sus colaboradores sin sobrecargar su operación.
          </p>
        </motion.div>

        <div className="relative">
          {/* Línea conectora Desktop (Horizontal) */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            style={{ transformOrigin: "left" }}
            className="hidden xl:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100 z-0"
          />

          {/* Línea conectora Mobile/Tablet (Vertical) */}
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            style={{ transformOrigin: "top" }}
            className="xl:hidden absolute top-0 bottom-0 left-[31px] md:left-[39px] w-0.5 bg-gradient-to-b from-blue-50 via-blue-100 to-transparent z-0"
          />

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 xl:grid-cols-4 gap-8 md:gap-12 xl:gap-8 relative z-10"
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                variants={cardVariants} 
                className="relative flex flex-row xl:flex-col gap-6 xl:gap-0 group"
              >
                {/* Conector Móvil (Punto en la línea) */}
                <div className="xl:hidden flex-shrink-0 relative z-10 mt-6 md:mt-4">
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-xl shadow-gray-200/20 group-hover:border-blue-100 transition-colors">
                    {React.cloneElement(step.icon, { className: "w-6 h-6 md:w-8 md:h-8 text-blue-600 group-hover:scale-110 transition-transform duration-500" })}
                  </div>
                </div>

                {/* Tarjeta Principal */}
                <motion.div 
                  whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-[2rem] p-6 md:p-8 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex-grow xl:h-full flex flex-col"
                >
                  
                  {/* Icono Desktop */}
                  <div className="hidden xl:flex justify-between items-start mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-white flex items-center justify-center shadow-inner border border-blue-100/50 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                      {step.icon}
                    </div>
                    <span className="text-5xl font-black text-transparent -webkit-text-stroke-1 -webkit-text-stroke-gray-100 group-hover:-webkit-text-stroke-blue-200 transition-all duration-500">
                      {step.id}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-blue-700 transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-500 text-[15px] leading-relaxed font-medium">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}