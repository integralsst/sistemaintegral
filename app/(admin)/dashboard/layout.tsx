"use client";

import Link from "next/link";
import Image from "next/image"; // Importamos Image para el logo
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Home,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { name: "Resumen", href: "/dashboard", icon: LayoutDashboard },
    { name: "Artículos del Blog", href: "/dashboard/posts", icon: FileText },
  ];

  const mockUser = {
    name: "Administrador",
    email: "admin@sisriesgos.com",
    initial: "A",
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Definimos colores principales en el diseño
  const colors = {
    primary: "blue-600",
    primaryHover: "blue-500",
    dark: "gray-950",
    darkAccent: "gray-900",
    logout: "red-500",
    white: "white",
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex font-sans selection:bg-${colors.primary}/20`}>
      {/* Overlay Móvil con Efecto de Cristal */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-500 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar - Estilo Premium Apple */}
      <aside
        className={`
        fixed md:relative inset-y-0 left-0 z-50 w-[280px] bg-gray-950/90 text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col border-r border-gray-800/50 backdrop-blur-md rounded-r-3xl md:rounded-none md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Cabecera del Sidebar con Logo */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <div className="relative h-10 w-full flex items-center justify-center">
              <Image 
                src="/images/logo.png" // Ruta de tu logo
                alt="Logo Sistema Integral"
                width={160} // Ajusta el tamaño según tu logo
                height={40}
                className="object-contain"
                priority // Carga prioritaria
              />
            </div>
            <span className="block text-[10px] text-center text-gray-400 uppercase tracking-[0.25em] font-semibold">
              Admin Workspace
            </span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-full bg-gray-900 text-white hover:text-blue-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Botón Nuevo Registro - Premium */}
        <div className="px-6 mb-8">
          <Link
            href="/dashboard/posts/new"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center justify-center gap-2.5 w-full bg-${colors.primary} hover:bg-${colors.primaryHover} text-white py-3 rounded-2xl font-medium transition-all duration-300 shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_25px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 group`}
          >
            <PlusCircle
              size={18}
              className="group-hover:rotate-90 transition-transform duration-500 ease-out"
            />
            <span>Nuevo Registro</span>
          </Link>
        </div>

        {/* Navegación Principal */}
        <nav className="px-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm group ${
                  isActive
                    ? "bg-white/10 text-white shadow-inner border border-white/5"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  size={18}
                  className={`transition-colors duration-300 ${
                    isActive ? `text-${colors.primary}` : "text-gray-400 group-hover:text-gray-100"
                  }`}
                />
                <span>{item.name}</span>
                {isActive && (
                  <div className={`absolute right-4 w-1 h-1 bg-${colors.primary} rounded-full`}></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Enlace Ir al Sitio Web */}
        <div className="px-4 pb-4">
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all font-medium text-sm border border-transparent hover:border-gray-800 group"
          >
            <Home
              size={18}
              className="text-gray-400 group-hover:text-white transition-colors"
            />
            <span>Ir al Sitio Web</span>
          </Link>
        </div>

        {/* Sección Usuario / Logout - Integrado */}
        <div className="p-6 bg-gray-900/40 border-t border-gray-800/50 mt-auto backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${colors.primary} to-blue-700 flex items-center justify-center text-white font-bold shadow-lg border border-white/10`}>
              {mockUser.initial}
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {mockUser.name}
              </p>
              <p className="text-xs text-gray-400 truncate tracking-tight">{mockUser.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className={`w-full flex items-center justify-center gap-2 bg-gray-900/70 hover:bg-${colors.logout}/10 text-gray-200 hover:text-${colors.logout} py-3.5 rounded-2xl transition-all text-sm font-medium border border-gray-800 hover:border-${colors.logout}/20 group disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <LogOut
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
          </button>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Cabecera Móvil - Transparente */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 p-4 flex items-center justify-between md:hidden z-30 sticky top-0 supports-[backdrop-filter]:bg-white/50">
          <div className="relative h-8 w-32">
            <Image 
              src="/images/logo.png" 
              alt="Logo Sistema Integral"
              fill
              className="object-contain object-left"
            />
          </div>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Contenido Dinámico */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}