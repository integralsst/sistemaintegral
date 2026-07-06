import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  FileText,
  ShieldCheck,
  Flame,
  Briefcase
} from "lucide-react";

export default function Services() {
  const serviceCategories = [
    {
      id: "gestion-documental",
      icon: <FileText size={24} />,
      title: "Gestión Documental",
      description: "Estructuración normativa, diseño de políticas, reglamentos y consolidación del SG-SST alineado a la legislación vigente.",
      imagePath: "/images/gestion-documental.webp" 
    },
    {
      id: "gestion-a-la-intervencion",
      icon: <ShieldCheck size={24} />,
      title: "Gestión a la Intervención",
      description: "Ejecución de inspecciones, controles operativos locativos y evaluación continua de riesgos en el entorno de trabajo.",
      imagePath: "/images/intervencion.webp" 
    },
    {
      id: "gestion-a-emergencias",
      icon: <Flame size={24} />,
      title: "Gestión a Emergencias",
      description: "Preparación táctica mediante formación de brigadas, planes de evacuación, simulacros y manejo de contingencias.",
      imagePath: "/images/emergencias.webp" 
    },
    {
      id: "gestion-especializada",
      icon: <Briefcase size={24} />,
      title: "Gestión Especializada",
      description: "Asesoría avanzada en tareas de alto riesgo, riesgo psicosocial, higiene industrial y vigilancia epidemiológica, dirigida a ARL y empresas en general.",
      imagePath: "/images/especializada.webp" 
    }
  ];

  return (
   <section id="servicios" className="w-full pt-12 pb-32 px-4 sm:px-6 lg:px-8 relative z-10 bg-white">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-700 font-semibold text-sm tracking-wide mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Operación a Nivel Nacional
        </div>

        {/* Etiqueta H1 actualizada con el degradado en el span */}
        <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tighter text-gray-950 mb-8 max-w-5xl">
          Seguridad Laboral. <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-cyan-300 to-blue-600 text-transparent bg-clip-text">
            Llevada al Siguiente Nivel.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl leading-relaxed tracking-tight mb-20">
          Automatiza las inspecciones y gestiona riesgos en tiempo real con un ecosistema integral diseñado para la protección absoluta de tu organización.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
          
          {serviceCategories.map((category, index) => (
            <Link 
              href={`/servicios/${category.id}`}
              key={index}
              className="group relative bg-[#f5f5f7] rounded-[2.5rem] flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-blue-600/10 hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer block"
            >
              
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-200">
                <Image
                  src={category.imagePath}
                  alt={category.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow bg-[#f5f5f7]">
                <div className="flex items-center gap-3 mb-4 text-blue-600">
                  {category.icon}
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {category.title}
                  </h3>
                </div>
                
                <p className="text-gray-500 font-medium text-[15px] leading-relaxed mb-6 flex-grow">
                  {category.description}
                </p>
                
                <div className="mt-auto pt-4 flex items-center gap-2 text-blue-600 font-semibold text-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Saber más 
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}