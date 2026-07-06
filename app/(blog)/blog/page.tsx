import React from 'react';
import Link from 'next/link';

export default function BlogIndexPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
          Blog Técnico y Normativo
        </h1>
        <p className="text-gray-600 text-[15px] max-w-2xl leading-relaxed">
          Actualizaciones, análisis de legislación y lineamientos técnicos para la prevención de riesgos laborales.
        </p>
      </div>

      {/* Grid temporal de artículos en construcción */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Tarjeta 1 */}
        <article className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2 block">
            Gestión Especializada
          </span>
          <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
            Implementación de modelos de precisión clínica para ARLs
          </h2>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            Contenido técnico en fase de redacción y revisión.
          </p>
          <Link href="/blog/modelos-precision" className="text-blue-600 text-sm font-semibold hover:underline">
            Leer artículo &rarr;
          </Link>
        </article>

        {/* Tarjeta 2 */}
        <article className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2 block">
            Gestión Documental
          </span>
          <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
            Actualización de matrices legales y cumplimiento
          </h2>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            Contenido técnico en fase de redacción y revisión.
          </p>
          <Link href="/blog/matrices-legales" className="text-blue-600 text-sm font-semibold hover:underline">
            Leer artículo &rarr;
          </Link>
        </article>

      </div>
    </div>
  );
}