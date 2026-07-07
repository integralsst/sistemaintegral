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
    <div className="min-h-screen bg-gray-50 flex font-sans selection:bg-blue-500/30">
      <div
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50 w-[280px] bg-gray-950 text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col border-r border-gray-800/60 shadow-2xl md:shadow-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="p-8 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
              <ShieldCheck className="text-blue-500" size={24} />
              Sistema Integral
            </span>
            <span className="block text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-2 font-semibold">
              Admin Workspace
            </span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg bg-gray-900 text-white hover:text-blue-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 mb-8">
          <Link
            href="/dashboard/posts/new"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center justify-center gap-2.5 w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 group"
          >
            <PlusCircle
              size={18}
              className="group-hover:rotate-90 transition-transform duration-500"
            />
            <span>Nuevo Registro</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                  isActive
                    ? "bg-white/10 text-white shadow-sm border border-white/5"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  size={18}
                  className={isActive ? "text-blue-400" : "text-gray-400"}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4">
          <Link
            href="/"
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-900 hover:text-white transition-all font-medium text-sm border border-transparent hover:border-gray-800 group"
          >
            <Home
              size={18}
              className="text-gray-400 group-hover:text-white transition-colors"
            />
            <span>Ir al Sitio Web</span>
          </Link>
        </div>

        <div className="p-6 bg-gray-900/50 border-t border-gray-800/60 mt-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg">
              {mockUser.initial}
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {mockUser.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{mockUser.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 bg-gray-900/80 hover:bg-red-500/10 text-white hover:text-red-400 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider border border-gray-800 hover:border-red-500/20 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogOut
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-4 flex items-center justify-between md:hidden z-30 sticky top-0">
          <span className="font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="text-blue-500" size={20} />
            Sistema Integral
          </span>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
}