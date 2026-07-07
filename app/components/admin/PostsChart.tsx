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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Pequeño retraso para que la animación de montado se vea fluida
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Configuraciones del SVG
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 40;

  // Cálculos para ubicar los puntos
  const maxPosts = Math.max(...data.map((d) => d.posts), 1);
  const minPosts = 0; // Base del gráfico

  const points = data.map((d, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / (data.length - 1);
    // Invertimos el eje Y porque en SVG el 0 está arriba
    const y = height - paddingY - ((d.posts - minPosts) / (maxPosts - minPosts)) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  // Construir los paths (trazos) del SVG
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ");
  // El área cerrada para el gradiente inferior
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="w-full relative mt-4 pt-6">
      
      {/* Contenedor del Gráfico con proporciones fijas */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] max-h-64">
        
        {/* Tooltip Flotante */}
        {hoveredIndex !== null && (
          <div 
            className="absolute z-20 bg-white/90 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-gray-900 text-xs font-bold py-1.5 px-3 rounded-xl pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-200"
            style={{
              left: `${(hoveredIndex / (data.length - 1)) * 100}%`,
              top: `calc(${ (points[hoveredIndex].y / height) * 100 }% - 12px)`
            }}
          >
            {data[hoveredIndex].posts} reg.
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradiente para la línea */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>

            {/* Gradiente para el área bajo la línea */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>

            {/* Máscara de recorte para la animación de entrada */}
            <clipPath id="revealClip">
              <rect
                x="0"
                y="0"
                width={mounted ? width : 0}
                height={height}
                className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </clipPath>
          </defs>

          {/* Grupo animado: Se revela de izquierda a derecha */}
          <g clipPath="url(#revealClip)">
            {/* Líneas guías de fondo horizontales (opcionales, dan aspecto pro) */}
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#e5e7eb" strokeWidth="1" />

            {/* Área sombreada bajo la línea */}
            <path d={areaPath} fill="url(#areaGradient)" />

            {/* Línea principal del gráfico */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
          </g>

          {/* Puntos interactivos sobre la línea */}
          {points.map((p, i) => (
            <g
              key={i}
              className={`transition-all duration-500 ease-out ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Área invisible más grande para facilitar el hover */}
              <circle cx={p.x} cy={p.y} r={20} fill="transparent" className="cursor-pointer" />
              
              {/* Punto visual */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 6 : 4}
                fill="#ffffff"
                stroke={hoveredIndex === i ? "#8b5cf6" : "#3b82f6"}
                strokeWidth="3"
                className="transition-all duration-200 shadow-sm pointer-events-none"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Etiquetas del eje X (Meses) */}
      <div className="flex justify-between items-center w-full mt-2 px-[4%]">
        {data.map((item, index) => (
          <span
            key={index}
            className={`text-xs font-semibold transition-colors duration-300 ${
              hoveredIndex === index ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}