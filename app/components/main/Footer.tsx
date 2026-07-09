"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Lock, LockOpen, ArrowUpRight } from "lucide-react";
import { motion, Variants, Transition, AnimatePresence } from "framer-motion";

// --- Tipado y Curvas ---
const appleEase = [0.16, 1, 0.3, 1] as const;

const baseTransition: Transition = {
  type: "tween",
  ease: appleEase,
  duration: 0.6,
};

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1, ease: appleEase }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: baseTransition }
};

// --- Datos Funcionales (Rutas Reales) ---
const companyLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Blog Técnico', href: '/blog' },
  { label: 'Contacto', href: '/contacto' }
];

const serviceLinks = [
  { label: 'Gestión Documental', href: '/servicios/gestion-documental' },
  { label: 'Gestión a la Intervención', href: '/servicios/gestion-a-la-intervencion' },
  { label: 'Gestión a Emergencias', href: '/servicios/gestion-a-emergencias' },
  { label: 'Gestión Especializada', href: '/servicios/gestion-especializada' }
];

// --- Iconos SVG ---
const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json();
        setAuthStatus(data.authenticated ? 'authenticated' : 'unauthenticated');
      } catch {
        setAuthStatus('unauthenticated');
      }
    };
    checkSession();
  }, []);

  return (
    <footer className="w-full bg-[#F5F5F7] px-4 sm:px-6 lg:px-8 pb-4 pt-10 font-sans antialiased overflow-hidden">
      
      {/* Tarjeta Isla del Footer - Diseño Ultra Compacto */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={baseTransition}
        className="max-w-[1400px] mx-auto bg-[#0A0A0B] text-white rounded-[2rem] relative overflow-hidden transform-gpu"
      >
        
        {/* Textura de Ruido para eliminar Banding */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Orbe de Luz Ambiental */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-600/15 rounded-full blur-[90px] pointer-events-none transform-gpu" />

        {/* Contenedor principal con paddings mínimos */}
        <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:pt-10 lg:pb-8">
          
          <motion.div 
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-8"
          >
            {/* Branding y Descripción */}
            <motion.div variants={itemVariants} className="w-full lg:w-3/12 flex flex-col">
              <Link href="/" className="mb-4 inline-block">
                <div className="relative w-28 h-8 flex-shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="SIS Logo"
                    fill
                    className="object-contain object-left brightness-0 invert transition-opacity duration-300 hover:opacity-80"
                    sizes="112px"
                  />
                </div>
              </Link>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-5 max-w-[260px] font-medium">
                Cumplimiento normativo del SG-SST de alta precisión. Sin fricciones operativas.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: <LinkedinIcon size={16} />, label: "LinkedIn", href: "https://linkedin.com" },
                  { icon: <InstagramIcon size={16} />, label: "Instagram", href: "https://instagram.com" }
                ].map((social, idx) => (
                  <motion.a 
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2, scale: 1.05 }}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Sub-grid para Enlaces y Operación (Maximiza el espacio horizontal) */}
            <div className="w-full lg:w-9/12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              
              {/* Links Corporativos */}
              <motion.div variants={itemVariants}>
                <h3 className="text-white font-bold mb-3 tracking-[0.15em] text-[10px] uppercase opacity-50">Compañía</h3>
                <ul className="space-y-2.5">
                  {companyLinks.map((item, idx) => (
                    <li key={idx}>
                      <Link href={item.href} className="group flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors text-xs md:text-sm">
                        {item.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-out hidden sm:block" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Links Servicios */}
              <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
                <h3 className="text-white font-bold mb-3 tracking-[0.15em] text-[10px] uppercase opacity-50">Intervención</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4">
                  {serviceLinks.map((item, idx) => (
                    <li key={idx}>
                      <Link href={item.href} className="group flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors text-xs md:text-sm">
                        <span className="line-clamp-1">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Información Operativa */}
              <motion.div variants={itemVariants} className="col-span-2 md:col-span-1 mt-2 md:mt-0">
                <h3 className="text-white font-bold mb-3 tracking-[0.15em] text-[10px] uppercase opacity-50">Contacto</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5">
                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-400 text-xs md:text-sm font-medium leading-tight">Pereira, Colombia</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span className="text-gray-400 text-xs md:text-sm font-medium">+57 (300) 000-0000</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="text-gray-400 text-xs md:text-sm font-medium">contacto@sisriesgos.com</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Bar Ultra Slim */}
          <div className="pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-20">
            <p className="text-gray-500 font-medium text-[10px] md:text-xs text-center md:text-left">
              © {currentYear} SIS Sistema Integral. Todos los derechos reservados.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-5 items-center text-[10px] md:text-xs font-medium text-gray-500">
              <Link href="/politica-privacidad" className="hover:text-white transition-colors">Privacidad</Link>
              <span className="w-1 h-1 rounded-full bg-gray-700"></span>
              <Link href="/terminos-condiciones" className="hover:text-white transition-colors">Términos</Link>
              
              {/* Auth Button Pill */}
              <Link href={authStatus === 'authenticated' ? "/dashboard" : "/login"} className="ml-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors duration-300
                    ${authStatus === 'authenticated' 
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20' 
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <AnimatePresence mode="wait">
                    {authStatus === 'loading' && (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-3 h-3 rounded-full border-[1.5px] border-current border-t-transparent animate-spin" />
                    )}
                    {authStatus === 'authenticated' && (
                      <motion.div key="auth" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                        <LockOpen size={12} className="stroke-[2px]" />
                      </motion.div>
                    )}
                    {authStatus === 'unauthenticated' && (
                      <motion.div key="unauth" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                        <Lock size={12} className="stroke-[2px]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                    {authStatus === 'authenticated' ? 'Dashboard' : 'Acceso'}
                  </span>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>

        {/* Marca de Agua Recortada */}
        <div className="absolute bottom-0 translate-y-1/2 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none z-0">
          <motion.h1 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.02 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[14vw] font-black tracking-tighter text-white whitespace-nowrap leading-none"
          >
            INTEGRAL.
          </motion.h1>
        </div>

      </motion.div>
    </footer>
  );
}