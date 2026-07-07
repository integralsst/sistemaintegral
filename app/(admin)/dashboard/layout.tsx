"use client";

import Link from "next/link";
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

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex font-sans antialiased selection:bg-blue-200 selection:text-blue-900">
      {/* Overlay Móvil con efecto Glass */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-500 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar - Estilo macOS Dark Mode */}
      <aside
        className={`
        fixed md:relative inset-y-0 left-0 z-50 w-[280px] bg-[#1C1C1E]/95 backdrop-blur-3xl text-gray-100 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col border-r border-white/10 shadow-2xl md:shadow-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo y Cabecera del Sidebar */}
        <div className="p-8 flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold tracking-tight text-white flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <ShieldCheck className="text-[#0A84FF]" size={22} />
              </div>
              Sistema Integral
            </span>
            <span className="block text-[10px] text-gray-400/80 uppercase tracking-widest mt-1.5 font-medium">
              Admin Workspace
            </span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* Botón de Acción Principal (Call to Action) */}
        <div className="px-5 mb-6">
          <Link
            href="/dashboard/posts/new"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-[#007AFF] hover:bg-[#0066CC] text-white py-3 rounded-2xl font-medium transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,122,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,122,255,0.4)] active:scale-[0.98] group"
          >
            <PlusCircle
              size={18}
              className="group-hover:rotate-90 transition-transform duration-500 ease-out"
            />
            <span>Nuevo Registro</span>
          </Link>
        </div>

        {/* Navegación Principal */}
        <nav className="px-3 space-y-1 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm group ${
                  isActive
                    ? "bg-[#007AFF] text-white shadow-sm"
                    : "text-gray-400 hover:bg-white/10 hover:text-gray-100"
                }`}
              >
                <item.icon
                  size={18}
                  className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200 transition-colors"}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Enlace de retorno al sitio */}
        <div className="px-3 pb-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-white/10 hover:text-gray-100 transition-all font-medium text-sm group"
          >
            <Home
              size={18}
              className="text-gray-400 group-hover:text-gray-200 transition-colors"
            />
            <span>Ir al Sitio Web</span>
          </Link>
        </div>

        {/* Sección de Usuario y Logout */}
        <div className="p-5 mx-3 mb-5 bg-white/[0.04] border border-white/[0.05] rounded-2xl mt-auto backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-white font-medium shadow-inner">
              {mockUser.initial}
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-100 truncate tracking-tight">
                {mockUser.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{mockUser.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-[#FF3B30]/10 text-gray-300 hover:text-[#FF3B30] py-2.5 rounded-xl transition-all duration-200 text-sm font-medium border border-transparent hover:border-[#FF3B30]/20 active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Cabecera Móvil - Estilo iOS */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/60 p-4 flex items-center justify-between md:hidden z-30 sticky top-0 supports-[backdrop-filter]:bg-white/50">
          <span className="font-semibold tracking-tight text-[#1D1D1F] flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <ShieldCheck className="text-[#007AFF]" size={18} />
            </div>
            Sistema Integral
          </span>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-gray-100/80 rounded-full text-gray-600 hover:bg-gray-200 transition-colors active:scale-95"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Área de Trabajo */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}