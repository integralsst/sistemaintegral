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
    <div className="h-full p-7 flex flex-col justify-between relative bg-gradient-to-br from-white to-gray-50">
      
      {/* Cabecera del Widget */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-1">
            Nivel de Satisfacción
          </p>
          <div className="flex items-center gap-1 mt-1 text-yellow-400">
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
            <span className="ml-2 text-sm font-bold text-gray-700">5.0</span>
          </div>
        </div>

        <button 
          onClick={handleRefresh}
          className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-blue-500 hover:shadow-sm transition-all"
          title="Actualizar métricas"
        >
          <RefreshCw size={16} className={`${isSpinning ? "animate-spin text-blue-500" : ""}`} />
        </button>
      </div>

      {/* Cuerpo del Widget (Contador) */}
      <div className="flex items-end gap-3 mt-4">
        <span className="text-4xl font-bold text-gray-800 tabular-nums tracking-tight">
          {count}
        </span>
        <span className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5">
          evaluaciones <CheckCircle2 size={14} className="text-green-500" />
        </span>
      </div>

      {/* Barra de progreso decorativa inferior */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
        <div className="h-full bg-green-500 w-[95%] rounded-r-full shadow-[0_0_8px_#22c55e]"></div>
      </div>
    </div>
  );
}