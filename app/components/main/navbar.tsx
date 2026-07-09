"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, Variants } from "framer-motion";

const Instagram = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Linkedin = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const servicios = [
  { name: "Gestión Documental", href: "/servicios/gestion-documental" },
  { name: "Gestión a la Intervención", href: "/servicios/gestion-a-la-intervencion" },
  { name: "Gestión a Emergencias", href: "/servicios/gestion-a-emergencias" },
  { name: "Gestión Especializada", href: "/servicios/gestion-especializada" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (isMobileMenuOpen) return;
    
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }

    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const isTransparentMode = isHome && !isScrolled;

  const navBgClass = isTransparentMode 
    ? "bg-white/5 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]" 
    : "bg-white/95 backdrop-blur-3xl border-gray-200/50 shadow-sm";
    
  const textClass = isTransparentMode 
    ? "text-white/80 hover:text-white" 
    : "text-gray-700 hover:text-black";
    
  const hoverBgClass = isTransparentMode 
    ? "hover:bg-white/10" 
    : "hover:bg-gray-100";
    
  const iconClass = isTransparentMode 
    ? "text-white/60 hover:text-white" 
    : "text-gray-500 hover:text-blue-600";
    
  const dropdownBgClass = isTransparentMode
    ? "bg-[#0a0a0a]/98 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
    : "bg-white/98 border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)]";

  const dropdownItemClass = isTransparentMode
    ? "text-gray-300 hover:text-white hover:bg-white/10"
    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50";

  const mobileMenuVariants: Variants = {
    closed: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const mobileItemVariants: Variants = {
    closed: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <>
      <motion.nav 
        className="fixed top-0 inset-x-0 z-[100] px-4 md:px-8 py-6 will-change-transform"
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={`mx-auto max-w-6xl flex justify-between items-center backdrop-blur-2xl border rounded-full px-6 py-3 transition-all duration-500 ${navBgClass}`}>
          
          <Link href="/" className="relative z-50 flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
            <Image 
              src="/images/logo.png" 
              alt="Logo SIS" 
              width={120} 
              height={40} 
              className={`w-auto h-8 object-contain transition-all duration-500 group-hover:scale-105 ${!isTransparentMode ? 'brightness-0' : ''}`} 
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 tracking-wide ${textClass} ${hoverBgClass}`}>
              INICIO
            </Link>

            <div 
              className="relative"
              onMouseEnter={() => setIsServicesHovered(true)}
              onMouseLeave={() => setIsServicesHovered(false)}
            >
              <button className={`flex items-center px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 tracking-wide ${textClass} ${hoverBgClass}`}>
                SERVICIOS
                <ChevronDown className={`w-4 h-4 ml-1.5 transition-transform duration-300 ${isServicesHovered ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {isServicesHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 backdrop-blur-3xl border rounded-2xl py-3 overflow-hidden z-[120] ${dropdownBgClass}`}
                  >
                    {servicios.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-6 py-3 text-sm font-medium transition-colors ${dropdownItemClass}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/blog" className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 tracking-wide ${textClass} ${hoverBgClass}`}>
              BLOG
            </Link>

            <Link href="/contacto" className={`px-5 py-2 rounded-full text-sm font-semibold text-[var(--color-sis-light)] transition-all duration-300 tracking-wide ml-2 ${isTransparentMode ? 'hover:bg-[var(--color-sis-light)]/20' : 'hover:bg-blue-50'}`}>
              CONTÁCTENOS
            </Link>
          </div>

          <div className="flex items-center gap-4 relative z-50">
            <div className={`hidden md:flex items-center gap-3 border-r pr-4 transition-colors duration-500 ${isTransparentMode ? 'border-white/10' : 'border-gray-200'}`}>
              <a href="#" className={`p-2 bg-transparent rounded-full transition-all duration-300 ${iconClass} ${hoverBgClass}`}>
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 bg-transparent rounded-full transition-all duration-300 ${iconClass} ${hoverBgClass}`}>
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-all duration-500 ${isTransparentMode ? 'text-white bg-white/10 hover:bg-white/20' : 'text-gray-900 bg-gray-100 hover:bg-gray-200'}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? "close" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MENÚ MÓVIL INMERSIVO */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              closed: { opacity: 0, backdropFilter: "blur(0px)" },
              open: { opacity: 1, backdropFilter: "blur(40px)" }
            }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-black/90 flex flex-col pt-32 px-6 pb-12 overflow-y-auto will-change-transform"
          >
            <motion.div variants={mobileMenuVariants} className="flex flex-col gap-8">
              <motion.div variants={mobileItemVariants}>
                <Link href="/" className="text-4xl font-semibold text-white tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>
                  Inicio
                </Link>
              </motion.div>
              
              <motion.div variants={mobileItemVariants} className="flex flex-col gap-5">
                <span className="text-sm font-bold text-blue-500 tracking-widest uppercase">
                  Servicios
                </span>
                <div className="flex flex-col gap-4">
                  {servicios.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      className="flex items-center justify-between text-2xl text-gray-300 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                      <ChevronRight className="w-5 h-5 opacity-30" />
                    </Link>
                  ))}
                </div>
              </motion.div>
              
              <div className="w-full h-px bg-white/10 my-4" />
              
              <motion.div variants={mobileItemVariants}>
                <Link href="/blog" className="text-4xl font-semibold text-white tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>
                  Blog
                </Link>
              </motion.div>
              
              <motion.div variants={mobileItemVariants}>
                <Link href="/contacto" className="text-4xl font-semibold text-white tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>
                  Contáctenos
                </Link>
              </motion.div>

              <motion.div variants={mobileItemVariants} className="flex gap-4 pt-8 mt-auto">
                <a href="#" className="p-4 bg-white/10 rounded-full text-white hover:bg-blue-500 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="p-4 bg-white/10 rounded-full text-white hover:bg-blue-500 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}