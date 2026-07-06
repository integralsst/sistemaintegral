import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  CalendarCheck, 
  MessageCircle,
  FileText,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { ServiceCategory } from '@/app/lib/data/services'; 

interface LayoutProps {
  data: ServiceCategory;
}

export default function DetalleServicioLayout({ data }: LayoutProps) {
  return (
    <main className="w-full min-h-[100dvh] bg-white pb-32 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navegación Breadcrumb Superior */}
      <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/#servicios" className="hover:text-blue-600 transition-colors">Servicios</Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[150px] sm:max-w-xs">{data.title}</span>
          </div>
          
          <Link 
            href="/#servicios" 
            className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span className="text-sm font-semibold">Volver</span>
          </Link>
        </div>
      </nav>

      {/* Banner Hero Panorámico */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10">
        <div className="w-full aspect-[21/9] md:aspect-[4/1] bg-gray-100 rounded-[2rem] relative overflow-hidden mb-12 shadow-sm border border-black/5 group">
          {/* Overlay sutil para hacer la imagen más elegante */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
          <Image 
            src={data.bannerImage} 
            alt={`Banner de ${data.title}`} 
            fill 
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            quality={100}
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Contenedor Principal: Layout de 2 Columnas en Desktop */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* COLUMNA IZQUIERDA: Contenido (Ocupa 8 columnas) */}
          <div className="lg:col-span-8 flex flex-col">
            
            <header className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs tracking-wide mb-6 uppercase">
                <ShieldCheck size={14} />
                Línea de Intervención SG-SST
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tighter text-gray-950 mb-6">
                {data.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
                {data.description}
              </p>
            </header>

            {/* Tarjeta de Lista de Servicios */}
            <div className="bg-[#f5f5f7] rounded-[2rem] p-8 md:p-10 mb-12 border border-white shadow-inner">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                Alcance del servicio
              </h2>
              <ul className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {data.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <div className="mt-1 flex-shrink-0 text-blue-600 bg-white p-1 rounded-full shadow-sm">
                      <CheckCircle2 size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-[15px] sm:text-base text-gray-700 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NUEVA SECCIÓN: Metodología / Beneficios (Ejemplo estático) */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                ¿Por qué elegir este servicio?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                  <ShieldCheck className="text-blue-600 mb-4" size={28} />
                  <h3 className="font-bold text-gray-900 mb-2">Cumplimiento Legal</h3>
                  <p className="text-sm text-gray-500">Evite sanciones alineando su empresa con la normativa legal vigente.</p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                  <TrendingUp className="text-blue-600 mb-4" size={28} />
                  <h3 className="font-bold text-gray-900 mb-2">Productividad</h3>
                  <p className="text-sm text-gray-500">Reduzca el ausentismo laboral creando entornos de trabajo seguros.</p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                  <FileText className="text-blue-600 mb-4" size={28} />
                  <h3 className="font-bold text-gray-900 mb-2">Gestión Integral</h3>
                  <p className="text-sm text-gray-500">Entregables documentados y planes de acción listos para ejecutar.</p>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: Sticky CTA Card (Ocupa 4 columnas) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              
              {/* Tarjeta Principal de Contacto */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-2xl shadow-blue-900/5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">¿Necesita implementar este servicio?</h3>
                <p className="text-sm text-gray-500 mb-8">
                  Nuestros expertos están listos para evaluar las necesidades específicas de su organización.
                </p>

                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white font-semibold text-[15px] px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-blue-600/20">
                    <CalendarCheck size={18} />
                    Agendar Asesoría Técnica
                  </button>
                  
                  <button className="w-full bg-green-50 text-green-700 font-semibold text-[15px] px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-100 transition-all duration-300">
                    <MessageCircle size={18} />
                    Consultar por WhatsApp
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    Operación a nivel nacional
                  </div>
                </div>
              </div>

              {/* Tarjeta Secundaria (Ej. Descargar Brochure) */}
              <button className="w-full bg-[#f5f5f7] border border-gray-200 rounded-2xl p-5 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-xl text-gray-600 group-hover:text-blue-600 transition-colors shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-gray-900 text-sm">Descargar Brochure</span>
                    <span className="block text-xs text-gray-500">PDF • 2.4 MB</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>

            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}