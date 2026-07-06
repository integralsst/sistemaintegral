import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { ServiceCategory } from '@/app/lib/data/services'; // Verifica que esta ruta sea la correcta en tu proyecto

interface LayoutProps {
  data: ServiceCategory;
}

export default function DetalleServicioLayout({ data }: LayoutProps) {
  return (
    <main className="w-full min-h-[100dvh] bg-white pb-32 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navegación tipo Breadcrumb Superior */}
      <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link 
            href="/#servicios" 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg"
            aria-label="Volver a servicios"
          >
            <ArrowLeft size={20} strokeWidth={2} />
            <span className="font-medium text-[15px]">Volver a servicios</span>
          </Link>
        </div>
      </nav>

      {/* 1. ESPACIO PARA IMAGEN: Banner Hero Panorámico */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10">
        <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-[#f5f5f7] rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden mb-12 md:mb-16 border border-gray-100 group">
          <Image 
            src={data.bannerImage} 
            alt={`Banner de ${data.title}`} 
            fill 
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            quality={100}
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Contenedor de Contenido Centrado (Optimizado para lectura sin columna derecha) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          
          <header className="mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 block mb-4">
              Línea de Intervención SG-SST
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tighter text-gray-900 mb-6">
              {data.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-3xl">
              {data.description}
            </p>
          </header>

          {/* Tarjeta de Lista de Servicios */}
          <div className="bg-[#f5f5f7] rounded-[2rem] p-8 md:p-10 mb-10 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 tracking-tight">
              Alcance del servicio
            </h2>
            <ul className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {data.items.map((item, index) => (
                <li key={index} className="flex items-start gap-4 group">
                  <div className="mt-1 flex-shrink-0 text-blue-600">
                    <CheckCircle2 size={22} strokeWidth={2} />
                  </div>
                  <span className="text-[15px] sm:text-base text-gray-700 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Call to Action Integrado */}
          <div className="pt-4 flex justify-start">
            <button className="bg-gray-900 text-white font-semibold text-[15px] px-8 py-4 rounded-full inline-flex items-center gap-2 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-gray-900/10 w-full sm:w-auto justify-center">
              Coordinar asesoría técnica
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
          
        </div>
      </div>
    </main>
  );
}