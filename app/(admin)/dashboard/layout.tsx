"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  X,
  Plus,
  Home,
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
    { name: "Artículos", href: "/dashboard/posts", icon: FileText },
  ];

  const mockUser = {
    name: "Administrador",
    email: "admin@sisriesgos.com",
    initial: "A",
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    /* Fondo principal: El color #F5F5F7 es el clásico gris claro de Apple */
    <div className="min-h-screen bg-[#F5F5F7] flex font-sans text-gray-900 overflow-hidden selection:bg-blue-200">
      
      {/* Overlay Móvil */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Flotante - Estilo Apple VisionOS / macOS 
        En lugar de pegarlo al borde, le damos margen (m-4) y lo hacemos flotar con efecto cristal.
      */}
      <aside
        className={`
        fixed md:relative inset-y-0 left-0 z-50 w-[280px] m-0 md:my-4 md:ml-4 bg-white/70 backdrop-blur-2xl 
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col 
        border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        rounded-r-3xl md:rounded-3xl
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Cabecera del Sidebar */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex flex-col gap-1 w-full">
            <div className="relative h-8 w-full flex items-center justify-start">
              {/* Reemplaza con tu logo real. Usando texto temporal elegante si no hay logo */}
              <span className="text-xl font-semibold tracking-tight text-black">
                SisRiesgos
              </span>
            </div>
            <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-1">
              Workspace
            </span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Botón Principal - Estilo Píldora de Apple */}
        <div className="px-6 mb-8">
          <Link
            href="/dashboard/posts/new"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-black hover:bg-gray-800 text-white py-3.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 group"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform duration-500 ease-out"
            />
            <span className="text-sm">Nuevo Registro</span>
          </Link>
        </div>

        {/* Navegación Principal */}
        <nav className="px-4 space-y-1 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-sm ${
                  isActive
                    ? "bg-white shadow-sm text-black border border-gray-100"
                    : "text-gray-500 hover:bg-white/50 hover:text-black"
                }`}
              >
                <item.icon
                  size={18}
                  className={`transition-colors duration-300 ${
                    isActive ? "text-blue-500" : "text-gray-400"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Enlaces Secundarios */}
        <div className="px-4 pb-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:bg-white/50 hover:text-black transition-all font-medium text-sm"
          >
            <Home size={18} className="text-gray-400" />
            <span>Ir al Sitio Web</span>
          </Link>
        </div>

        {/* Sección de Usuario - Minimalista */}
        <div className="p-4 m-4 bg-white/50 rounded-2xl border border-white/60">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-inner">
              {mockUser.initial}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {mockUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {mockUser.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 py-2.5 rounded-xl transition-colors text-sm font-medium border border-gray-100 disabled:opacity-50"
          >
            <LogOut size={16} />
            {isLoggingOut ? "Saliendo..." : "Cerrar Sesión"}
          </button>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Cabecera Móvil - Glassmorphism */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 p-4 flex items-center justify-between md:hidden z-30 sticky top-0">
          <span className="text-lg font-semibold tracking-tight text-black">
            SisRiesgos
          </span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white shadow-sm rounded-full text-gray-600 hover:text-black border border-gray-100"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Contenido Dinámico */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}