"use client";

import React, { useEffect, useState } from "react";

type ChartData = {
  name: string;
  posts: number;
  month: number;
  year: number;
};

export default function PostsChart({ data }: { data: ChartData[] }) {
  const [mounted, setMounted] = useState(false);

  // Animación de entrada al montar el componente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Encontrar el valor máximo para calcular los porcentajes de altura de las barras
  const maxValue = Math.max(...data.map((d) => d.posts), 1);

  return (
    <div className="w-full h-64 mt-4 flex items-end justify-between gap-3 sm:gap-6 pt-6">
      {data.map((item, index) => {
        // Calculamos la altura en porcentaje relativa al valor más alto
        const heightPercentage = mounted ? (item.posts / maxValue) * 100 : 0;

        return (
          <div key={index} className="flex flex-col items-center flex-1 group h-full justify-end">
            
            {/* Tooltip flotante - Estilo Glassmorphism */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 mb-3 bg-white/90 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-gray-900 text-xs font-bold py-1.5 px-3 rounded-xl pointer-events-none transform translate-y-2 group-hover:translate-y-0">
              {item.posts}
            </div>

            {/* Contenedor de la barra (Riel) */}
            <div className="w-full max-w-[48px] relative bg-gray-200/40 rounded-full overflow-hidden flex items-end h-[80%] shadow-inner transition-colors duration-300 group-hover:bg-gray-200/60">
              
              {/* Barra Animada Tipo Píldora */}
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-full transition-all duration-1000 ease-out group-hover:from-blue-500 group-hover:to-blue-300 relative"
                style={{ height: `${heightPercentage}%` }}
              >
                {/* Reflejo sutil de cristal en la barra */}
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none"></div>
              </div>
            </div>

            {/* Etiqueta del mes */}
            <span className="mt-4 text-xs font-semibold text-gray-400 group-hover:text-gray-900 transition-colors duration-300">
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}