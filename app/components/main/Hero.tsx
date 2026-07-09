"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
}

const slides: Slide[] = [
  { id: 1, image: "/images/Banner1.png" },
  { id: 2, image: "/images/Banner2.png" },
  { id: 3, image: "/images/Banner3.png" },
  { id: 4, image: "/images/Banner4.png" },
];

const SLIDE_DURATION = 6000;
const APPLE_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0, filter: "blur(8px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: APPLE_EASE,
    },
  },
};

const buttonSpring: Transition = { 
  type: "spring", 
  stiffness: 400, 
  damping: 25 
};

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  return (
    <section
      className="relative w-full min-h-[100dvh] bg-[#050505] overflow-hidden group font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Capa de Fondo */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <Image
              src={slides[currentSlide].image}
              alt={`Banner SG-SST ${slides[currentSlide].id}`}
              fill
              className="object-cover object-center"
              priority={currentSlide === 0}
              sizes="100vw"
            />
            
            {/* Scrims de Contraste */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent w-full md:w-3/4 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Contenedor Principal (Con padding superior "pt-32" para respetar el Navbar) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center pt-32 pb-16 px-6 md:px-16 container mx-auto pointer-events-none">
        
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-900/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative z-10 max-w-3xl pointer-events-auto"
          >
            
            {/* Título Redimensionado a text-[5rem] para mejor encuadre */}
            <motion.h1 
              variants={itemVariants}
              className="text-white text-5xl md:text-6xl lg:text-[5rem] font-extrabold leading-[1.02] tracking-tighter mb-6"
              style={{ textShadow: "0px 10px 30px rgba(0,0,0,0.8)" }}
            >
              Cumplimiento Legal.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Sin Complicaciones.
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-gray-300 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mb-10"
              style={{ textShadow: "0px 2px 8px rgba(0,0,0,0.9)" }}
            >
              Diseñamos, implementamos y auditamos tu Sistema de Gestión para proteger a tu equipo y blindar tu empresa ante las normativas de riesgos laborales.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={buttonSpring}
                className="px-8 py-4 rounded-full bg-white text-black font-bold text-base shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow"
              >
                Solicitar Asesoría
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                whileTap={{ scale: 0.96 }}
                transition={buttonSpring}
                className="px-8 py-4 rounded-full bg-transparent backdrop-blur-md border border-white/30 text-white font-semibold text-base transition-colors"
              >
                Conocer Servicios
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de Navegación Simplificados */}
      <div className="absolute right-6 bottom-10 md:bottom-12 z-20 flex gap-4 pointer-events-auto">
        <motion.button
          onClick={prevSlide}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          whileTap={{ scale: 0.9 }}
          transition={buttonSpring}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-2xl border border-white/10 text-white shadow-xl"
          aria-label="Anterior banner"
        >
          <ChevronLeft className="w-6 h-6 opacity-90" />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          whileTap={{ scale: 0.9 }}
          transition={buttonSpring}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-2xl border border-white/10 text-white shadow-xl"
          aria-label="Siguiente banner"
        >
          <ChevronRight className="w-6 h-6 opacity-90" />
        </motion.button>
      </div>
    </section>
  );
}