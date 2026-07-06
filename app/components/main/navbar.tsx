"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

// Íconos SVG personalizados para reemplazar los que Lucide eliminó
const Instagram = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Linkedin = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const servicios = [
    { name: "Programas Educativos", href: "/servicios/programas-educativos" },
    { name: "Servicios Especializados", href: "/servicios/especializados" },
    { name: "Diseño e Implementación del SG-SST", href: "/servicios/sg-sst" },
    { name: "Outsourcing Especializado en SST", href: "/servicios/outsourcing" },
  ];

  const nosotros = [
    { name: "Quienes Somos", href: "/nosotros/quienes-somos" },
    { name: "Certificaciones", href: "/nosotros/certificaciones" },
    { name: "Trabaje con Nosotros", href: "/nosotros/trabaje-con-nosotros" },
    { name: "PQRSF", href: "/nosotros/pqrsf" },
    { name: "Pagos PSE", href: "/nosotros/pagos-pse" },
  ];

  return (
    // Navbar principal con efecto "Glass" sutil
    <nav className="absolute top-0 w-full z-50 bg-white/95 backdrop-blur-md text-gray-800 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Image 
                src="/images/logo.png" 
                alt="Logo de Sistema Integral" 
                width={150} 
                height={50} 
                className="w-auto h-12 object-contain" 
                priority
              />
            </Link>
          </div>

          {/* Menú de Escritorio */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
              INICIO
            </Link>

            {/* Dropdown Servicios */}
            <div className="relative group py-6">
              <button className="flex items-center text-sm font-medium hover:text-blue-600 transition-colors">
                SERVICIOS
                <ChevronDown className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
              {/* Menú flotante estilo Apple (Glassmorphism + Sombras suaves) */}
              <div className="absolute left-0 mt-0 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100/50 transform origin-top -translate-y-2 group-hover:translate-y-0">
                {servicios.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50/80 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Dropdown Nosotros */}
            <div className="relative group py-6">
              <button className="flex items-center text-sm font-medium hover:text-blue-600 transition-colors">
                NOSOTROS
                <ChevronDown className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
              <div className="absolute left-0 mt-0 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100/50 transform origin-top -translate-y-2 group-hover:translate-y-0">
                {nosotros.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50/80 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/blog" className="text-sm font-medium hover:text-blue-600 transition-colors">
              BLOG
            </Link>

            <Link href="/contacto" className="text-sm font-medium hover:text-blue-600 transition-colors">
              CONTÁCTENOS
            </Link>
          </div>

          {/* Iconos Redes Sociales (Escritorio) */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" strokeWidth={1.5} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none p-2"
              aria-label="Alternar menú"
            >
              {/* Transición suave entre hamburguesa y X */}
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 animate-in fade-in zoom-in duration-200" strokeWidth={1.5} />
              ) : (
                <Menu className="h-6 w-6 animate-in fade-in zoom-in duration-200" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable (Apple Style) */}
      <div 
        className={`md:hidden absolute w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-6 space-y-6">
          <Link href="/" className="block text-lg font-medium text-gray-800 hover:text-blue-600">Inicio</Link>
          
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Servicios</div>
            <div className="flex flex-col space-y-3 pl-4 border-l border-gray-100">
              {servicios.map((item) => (
                <Link key={item.name} href={item.href} className="text-gray-600 hover:text-blue-600">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Nosotros</div>
            <div className="flex flex-col space-y-3 pl-4 border-l border-gray-100">
              {nosotros.map((item) => (
                <Link key={item.name} href={item.href} className="text-gray-600 hover:text-blue-600">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <Link href="/blog" className="block text-lg font-medium text-gray-800 hover:text-blue-600">Blog</Link>
          <Link href="/contacto" className="block text-lg font-medium text-gray-800 hover:text-blue-600">Contáctenos</Link>

          {/* Redes en móvil */}
          <div className="flex items-center space-x-6 pt-6 border-t border-gray-100">
            <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="Instagram">
              <Instagram className="w-6 h-6" strokeWidth={1.5} />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="LinkedIn">
              <Linkedin className="w-6 h-6" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}