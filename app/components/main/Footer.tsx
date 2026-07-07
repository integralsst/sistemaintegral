"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Importamos el ícono Lock de lucide-react
import { Mail, Phone, MapPin, Lock } from 'lucide-react';

// SVGs nativos para redes sociales (minimalistas)
const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f5f5f7] text-gray-600 pt-20 pb-10 border-t border-gray-200/60 font-sans antialiased">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 pb-16">
          
          {/* Columna 1: Logo y Descripción */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col">
            <Link href="/" className="mb-6 inline-block">
              {/* Contenedor del Logo: object-left asegura que quede alineado con el texto */}
              <div className="relative w-32 h-12 flex-shrink-0">
                <Image 
                  src="/images/logo.png" 
                  alt="SIS Logo" 
                  fill 
                  className="object-contain object-left transition-opacity duration-300 hover:opacity-80"
                  sizes="(max-width: 768px) 128px, 128px"
                />
              </div>
            </Link>
            <p className="text-gray-500 text-[14px] leading-relaxed mb-8 max-w-sm font-medium">
              Sistema Integral en Riesgos Laborales. Soluciones de alto valor para ARL y empresas en general. Cumplimiento legal sin complicaciones.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2.5 bg-white border border-gray-200/80 rounded-full text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all duration-300" aria-label="LinkedIn">
                <LinkedinIcon size={18} />
              </a>
              <a href="#" className="p-2.5 bg-white border border-gray-200/80 rounded-full text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all duration-300" aria-label="Instagram">
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="md:col-span-4 lg:col-span-2 lg:col-start-6">
            <h3 className="text-gray-900 font-bold mb-5 tracking-widest text-[11px] uppercase">Compañía</h3>
            <ul className="space-y-3.5">
              <li><Link href="/" className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-[14px]">Inicio</Link></li>
              <li><Link href="/#nosotros" className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-[14px]">Nosotros</Link></li>
              <li><Link href="/blog" className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-[14px]">Blog Técnico</Link></li>
              <li><Link href="/contacto" className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-[14px]">Contacto</Link></li>
            </ul>
          </div>

          {/* Columna 3: Servicios SG-SST */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-gray-900 font-bold mb-5 tracking-widest text-[11px] uppercase">Líneas de Intervención</h3>
            <ul className="space-y-3.5">
              <li><Link href="/servicios/gestion-documental" className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-[14px]">Gestión Documental</Link></li>
              <li><Link href="/servicios/gestion-a-la-intervencion" className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-[14px]">Gestión a la Intervención</Link></li>
              <li><Link href="/servicios/gestion-a-emergencias" className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-[14px]">Gestión a Emergencias</Link></li>
              <li><Link href="/servicios/gestion-especializada" className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-[14px]">Gestión Especializada</Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-gray-900 font-bold mb-5 tracking-widest text-[11px] uppercase">Operación Nacional</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                <span className="text-gray-500 text-[14px] font-medium leading-relaxed">
                  Sede Administrativa<br />Pereira, Colombia
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={18} className="text-gray-400" />
                <span className="text-gray-500 text-[14px] font-medium">+57 (300) 000-0000</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={18} className="text-gray-400" />
                <span className="text-gray-500 text-[14px] font-medium">contacto@sisriesgos.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Línea Divisoria y Copyright */}
        <div className="pt-8 border-t border-gray-200/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#86868b] font-medium text-[12px]">
            © {currentYear} SIS Sistema Integral en Riesgos Laborales. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 items-center text-[12px] font-medium text-[#86868b]">
            <Link href="/politica-privacidad" className="hover:text-gray-900 transition-colors">Política de Privacidad</Link>
            <span className="w-px h-3 bg-gray-300 self-center hidden md:block"></span>
            <Link href="/terminos-condiciones" className="hover:text-gray-900 transition-colors">Términos de Servicio</Link>
            
            {/* Divisor y botón de inicio de sesión con candado */}
            <span className="w-px h-3 bg-gray-300 self-center hidden md:block"></span>
            <Link 
              href="/login" 
              className="hover:text-gray-900 transition-all duration-300 hover:scale-110 flex items-center justify-center p-1" 
              aria-label="Iniciar Sesión"
              title="Acceso al sistema"
            >
              <Lock size={14} className="stroke-[2.5px]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}