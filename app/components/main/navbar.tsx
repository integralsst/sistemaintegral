"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";

// Íconos SVG personalizados
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

  // Bloquear el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  // Sincronizado con los 4 items de tu componente Services
  const servicios = [
    { name: "Gestión Documental", href: "/servicios/gestion-documental" },
    { name: "Gestión a la Intervención", href: "/servicios/gestion-a-la-intervencion" },
    { name: "Gestión a Emergencias", href: "/servicios/gestion-a-emergencias" },
    { name: "Gestión Especializada", href: "/servicios/gestion-especializada" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[999] bg-white/80 backdrop-blur-md text-gray-800 border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center relative z-50">
              <Link href="/" className="transition-opacity hover:opacity-80" onClick={() => setIsMobileMenuOpen(false)}>
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
            <div className="md:hidden flex items-center relative z-50">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-900 hover:text-blue-600 focus:outline-none p-2 bg-gray-50/50 rounded-full transition-colors"
                aria-label="Alternar menú"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300 rotate-90" strokeWidth={1.5} />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay del Menú Móvil (Pantalla Completa) */}
      <div 
        className={`md:hidden fixed inset-0 top-0 z-40 bg-white/98 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        <div className="h-full overflow-y-auto px-6 pt-28 pb-12">
          <div className="flex flex-col space-y-8">
            
            <Link 
              href="/" 
              className="text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            
            <div className="space-y-4">
              <div className="text-sm font-bold text-blue-600 tracking-wider">SERVICIOS</div>
              <div className="flex flex-col space-y-4">
                {servicios.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    className="flex items-center justify-between text-xl text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                    <ChevronRight className="w-5 h-5 opacity-40" />
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 space-y-6">
              <Link 
                href="/blog" 
                className="block text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/contacto" 
                className="block text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contáctenos
              </Link>
            </div>

            {/* Redes en móvil */}
            <div className="flex items-center space-x-8 pt-8 mt-auto">
              <a href="#" className="text-gray-400 hover:text-blue-600 bg-gray-50 p-4 rounded-full transition-colors" aria-label="Instagram">
                <Instagram className="w-7 h-7" strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 bg-gray-50 p-4 rounded-full transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-7 h-7" strokeWidth={1.5} />
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}