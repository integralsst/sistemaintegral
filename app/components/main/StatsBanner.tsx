"use client";

import React, { useEffect, useState, useRef } from 'react';

// Subcomponente lógico para manejar la iteración de los números
const AnimatedCounter = ({ target, duration = 2000, suffix = "" }: { target: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Desconecta el observador para que la animación ocurra solo una vez
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 } // Se activa cuando el 10% del componente es visible
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Función matemática (easeOutExpo) para que desacelere suavemente al llegar al final
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * (target - startValue) + startValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [target, duration, isVisible]);

  // Formatea el número para incluir la coma de miles (ej: 15,000)
  const formattedNumber = new Intl.NumberFormat('en-US').format(count);

  return (
    <div ref={ref} className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 tracking-tighter">
      {target > 100 ? "+" : ""}{formattedNumber}{suffix}
    </div>
  );
};

export default function StatsBanner() {
  return (
    <section className="w-full bg-blue-600 py-16 md:py-24 relative overflow-hidden">
      
      {/* Capa de textura sutil (Degradado para evitar un color plano excesivamente brillante) */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 opacity-80 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Estructura dividida por líneas sutiles tipo Apple */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 md:divide-x divide-white/20 text-center">

          <div className="flex flex-col items-center justify-center">
            <AnimatedCounter target={15000} />
            <p className="text-blue-100 text-lg md:text-xl font-medium tracking-wide">
              Capacitaciones realizadas
            </p>
          </div>

          <div className="flex flex-col items-center justify-center pt-12 md:pt-0 border-t border-white/20 md:border-t-0">
            <AnimatedCounter target={30000} />
            <p className="text-blue-100 text-lg md:text-xl font-medium tracking-wide">
              Empresas asesoradas
            </p>
          </div>

          <div className="flex flex-col items-center justify-center pt-12 md:pt-0 border-t border-white/20 md:border-t-0">
            <AnimatedCounter target={100} suffix="%" />
            <p className="text-blue-100 text-lg md:text-xl font-medium tracking-wide">
              Clientes satisfechos
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}