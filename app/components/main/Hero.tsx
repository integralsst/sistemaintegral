"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Tienes los 7 configurados. Si quieres mostrarlos todos, quita los "//" de los últimos 3.
// Mi recomendación es usar solo de 3 a 4.
const slides = [
  { id: 1, image: "/images/Banner1.png" },
  { id: 2, image: "/images/Banner2.png" },
  { id: 3, image: "/images/Banner3.png" },
  { id: 4, image: "/images/Banner4.png" },
//   { id: 5, image: "/images/Banner5.webp" },
  // { id: 6, image: "/images/Banner6.webp" },
  // { id: 7, image: "/images/Banner7.webp" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full max-w-[1920px] mx-auto aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] bg-white overflow-hidden">
      
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
         <Image
            src={slide.image}
            alt={`Banner ${slide.id}`}
            fill
            className="object-cover object-top"
            priority={index === 0} 
            quality={100} // Evita la compresión agresiva por defecto (75%)
            sizes="100vw" // Le dice al navegador que descargue la versión de ancho completo
          />
        </div>
      ))}

      {/* Marco Inferior Curvo */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          className="w-full h-[30px] md:h-[60px] lg:h-[90px] text-white"
        >
          <path 
            d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" 
            fill="currentColor"
          ></path>
        </svg>
      </div>

      {/* Indicadores (Dots) a la derecha */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full shadow-sm ${
              index === currentSlide 
                ? "w-4 h-4 bg-sis-light border-2 border-white scale-110" 
                : "w-3 h-3 bg-white/60 hover:bg-white border border-transparent"
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}