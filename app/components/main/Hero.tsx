"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants, Transition, PanInfo } from "framer-motion";
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
const SWIPE_CONFIDENCE_THRESHOLD = 10000;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: APPLE_EASE },
  },
};

const buttonSpring: Transition = { type: "spring", stiffness: 400, damping: 25 };

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
      nextSlide();
    } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
      prevSlide();
    }
  };

  return (
    <section className="relative w-full min-h-[100svh] bg-[#050505] overflow-hidden font-sans">
      
      <motion.div 
        className="absolute inset-0 z-20 touch-pan-y md:hidden" 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onDragEnd={handleDragEnd}
      />

      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        >
          <div className="w-full h-full relative">
            <Image
              src={slides[currentSlide].image}
              alt={`Banner SG-SST ${slides[currentSlide].id}`}
              fill
              className="object-cover object-[center_top] md:object-center"
              priority={currentSlide === 0}
              sizes="100vw"
            />
            
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-black/40 md:via-transparent to-transparent md:bg-gradient-to-r md:from-black/95 md:via-black/60 md:w-3/4" />
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-28 md:justify-center md:pt-32 md:pb-16 px-6 md:px-16 container mx-auto pointer-events-none">
        
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-900/20 blur-[120px] rounded-full -z-10" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-3xl pointer-events-auto w-full flex flex-col items-center text-center md:items-start md:text-left"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-white text-[2.75rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold md:leading-[1.02] tracking-tight md:tracking-tighter mb-5 md:mb-6"
            style={{ textShadow: "0px 10px 30px rgba(0,0,0,0.8)" }}
          >
            <span className="block">Gestión SG-SST.</span>
            <span className="block mt-1 md:mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Cumplimiento Estratégico.
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-gray-200 text-[16px] sm:text-lg md:text-xl font-medium leading-relaxed max-w-[95%] md:max-w-2xl mx-auto md:mx-0 mb-8 md:mb-12"
            style={{ textShadow: "0px 2px 8px rgba(0,0,0,0.9)" }}
          >
            Simplificamos la implementación y auditoría de tu sistema.
            <span className="hidden md:inline"> Protege a tu equipo humano y asegura el cumplimiento legal de tu empresa sin reprocesos.</span>
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 md:gap-5 w-full sm:w-auto items-center">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={buttonSpring}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-[15px] md:text-base shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-shadow"
            >
              Solicitar Asesoría
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.96 }}
              transition={buttonSpring}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent backdrop-blur-md border border-white/30 text-white font-semibold text-[15px] md:text-base transition-colors"
            >
              Conocer Servicios
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <div className="hidden md:flex absolute right-6 bottom-10 md:bottom-12 z-20 gap-4 pointer-events-auto">
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

      <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-16 bottom-8 md:bottom-12 z-20 flex gap-3 pointer-events-auto">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              index === currentSlide 
                ? "bg-white w-6 shadow-[0_0_12px_rgba(255,255,255,0.9)]" 
                : "bg-white/40 w-2 md:w-2.5 hover:bg-white/70"
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}