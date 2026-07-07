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
    <div className="w-full h-64 mt-4 flex items-end justify-between gap-2 sm:gap-4 pt-6">
      {data.map((item, index) => {
        // Calculamos la altura en porcentaje relativa al valor más alto
        const heightPercentage = mounted ? (item.posts / maxValue) * 100 : 0;

        return (
          <div key={index} className="flex flex-col items-center flex-1 group">
            {/* Tooltip flotante al hacer hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded shadow-lg pointer-events-none">
              {item.posts}
            </div>

            {/* Barra animada */}
            <div className="w-full relative bg-blue-50 rounded-t-md overflow-hidden flex items-end h-full">
              <div
                className="w-full bg-blue-500 rounded-t-md transition-all duration-1000 ease-out group-hover:bg-blue-400"
                style={{ height: `${heightPercentage}%` }}
              >
                {/* Brillo decorativo superior de la barra */}
                <div className="w-full h-1 bg-white/30 rounded-t-md"></div>
              </div>
            </div>

            {/* Etiqueta del mes */}
            <span className="mt-3 text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}