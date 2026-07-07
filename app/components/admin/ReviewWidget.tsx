"use client";

import { useState } from "react";
import { Star, RefreshCw, CheckCircle2 } from "lucide-react";

export default function ReviewWidget({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    // Simulamos una llamada a la API que trae nuevos datos después de 1 segundo
    setTimeout(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3));
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <div className="h-full p-7 flex flex-col justify-between relative bg-transparent">
      
      {/* Cabecera del Widget */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
            Nivel de Satisfacción
          </p>
          <div className="flex items-center gap-1 mt-1 text-amber-400">
            <Star fill="currentColor" size={16} className="drop-shadow-sm" />
            <Star fill="currentColor" size={16} className="drop-shadow-sm" />
            <Star fill="currentColor" size={16} className="drop-shadow-sm" />
            <Star fill="currentColor" size={16} className="drop-shadow-sm" />
            <Star fill="currentColor" size={16} className="drop-shadow-sm" />
            <span className="ml-2 text-sm font-bold text-gray-800">5.0</span>
          </div>
        </div>

        {/* Botón de Refrescar - Estilo Glass */}
        <button 
          onClick={handleRefresh}
          className="p-2.5 bg-white/60 backdrop-blur-sm border border-white shadow-sm rounded-full text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-md transition-all active:scale-95"
          title="Actualizar métricas"
        >
          <RefreshCw size={16} className={`${isSpinning ? "animate-spin text-blue-600" : ""}`} />
        </button>
      </div>

      {/* Cuerpo del Widget (Contador) */}
      <div className="flex items-end gap-3 mt-6 z-10">
        <span className="text-5xl font-semibold text-gray-900 tabular-nums tracking-tight">
          {count}
        </span>
        <span className="text-sm font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
          evaluaciones <CheckCircle2 size={16} className="text-green-500" strokeWidth={2.5} />
        </span>
      </div>

      {/* Barra de progreso decorativa inferior - Más suave y brillante */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100/50 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-400 to-green-500 w-[95%] rounded-r-full shadow-[0_0_12px_rgba(34,197,94,0.5)]"></div>
      </div>
    </div>
  );
}