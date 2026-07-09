"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { id: 1, image: "/images/Banner1.png" },
  { id: 2, image: "/images/Banner2.png" },
  { id: 3, image: "/images/Banner3.png" },
  { id: 4, image: "/images/Banner4.png" },
];

const SLIDE_DURATION = 6000;

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const textVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      className="relative w-full h-screen min-h-[700px] bg-black overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
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
            transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
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
            
            <div className="absolute inset-0 bg-black/45 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-full md:w-3/4 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* FIX DE ESPACIADO: Cambiado a justify-center con pt-32 y pb-10 para que nunca choque con el Navbar */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center pt-32 pb-10 px-6 md:px-16 container mx-auto pointer-events-none">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${currentSlide}`}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative z-10 max-w-3xl pointer-events-auto"
          >
            
            <motion.div 
              className="relative inline-flex items-center gap-3 px-5 py-2.5 mb-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] overflow-hidden group/pill cursor-default"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div 
                className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 z-0"
                animate={{ x: ["-100%", "50%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 1 }}
              />
              <div className="relative flex h-2.5 w-2.5 z-10">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-sis-light)] opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-sis-light)] shadow-[0_0_8px_var(--color-sis-light)]"></div>
              </div>
              <span className="relative z-10 text-white/90 font-semibold tracking-widest text-xs md:text-sm uppercase drop-shadow-md">
                Gestión Integral SG-SST
              </span>
            </motion.div>
            
            <h1 
              className="text-white text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight mb-6"
              style={{ textShadow: "0px 4px 16px rgba(0,0,0,0.8)" }}
            >
              Cumplimiento Legal.<br />
              Sin Complicaciones.
            </h1>

            <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-10 drop-shadow-lg">
              Diseñamos, implementamos y auditamos tu Sistema de Gestión para proteger a tu equipo y blindar tu empresa ante las normativas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 rounded-full bg-white text-black font-semibold text-base hover:scale-105 transition-all duration-300 shadow-xl">
                Solicitar Asesoría
              </button>
              <button className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium text-base hover:bg-white/20 hover:border-white/50 transition-all duration-300">
                Conocer Servicios
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      <div className="absolute right-6 bottom-10 md:bottom-20 z-20 flex gap-4">
        <button
          onClick={prevSlide}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-white/40 hover:scale-110 transition-all duration-300"
          aria-label="Anterior banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-white/40 hover:scale-110 transition-all duration-300"
          aria-label="Siguiente banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute left-6 md:left-16 bottom-10 md:bottom-12 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="relative w-12 md:w-16 h-1 rounded-full bg-white/30 overflow-hidden"
            aria-label={`Ir al banner ${index + 1}`}
          >
            {index === currentSlide && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                className="absolute top-0 left-0 h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}