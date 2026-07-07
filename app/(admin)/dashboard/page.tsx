import { FileText, TrendingUp, Activity } from "lucide-react";
import ReviewWidget from "../../components/admin/ReviewWidget"; 
import PostsChart from "../../components/admin/PostsChart"; 

export default function AdminDashboard() {
  
  // Datos estáticos (Mock Data)
  const stats = {
    postsCount: 42,
    reviewCount: 88,
    chartData: [
      { name: "Ene", posts: 4, month: 0, year: 2026 },
      { name: "Feb", posts: 7, month: 1, year: 2026 },
      { name: "Mar", posts: 5, month: 2, year: 2026 },
      { name: "Abr", posts: 12, month: 3, year: 2026 },
      { name: "May", posts: 9, month: 4, year: 2026 },
      { name: "Jun", posts: 15, month: 5, year: 2026 },
    ]
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700">
      
      {/* Cabecera - Tipografía limpia y márgenes generosos */}
      <header className="mb-10 px-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2 tracking-tight">
            Panel de Control
        </h1>
        <p className="text-gray-500 text-sm md:text-base font-medium">
            Gestiona la plataforma y visualiza las métricas del sistema.
        </p>
      </header>

      {/* GRID DE MÉTRICAS - Estilo Glassmorphism / Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Artículos Totales */}
        <div className="bg-white/70 backdrop-blur-2xl p-7 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-6 relative overflow-hidden group transition-all duration-500">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform duration-500">
            <FileText size={24} strokeWidth={1.5} />
          </div>
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-1">
              Total Registros
            </p>
            <p className="text-4xl font-semibold text-gray-900 tracking-tight">
              {stats.postsCount}
            </p>
          </div>
          {/* Brillo sutil de fondo */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
        </div>

        {/* Card 2: Widget Dinámico 
            Mantenemos el componente intacto pero actualizamos su contenedor 
        */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col justify-center">
            <ReviewWidget initialCount={stats.reviewCount} />
        </div>

        {/* Card 3: Estado del Sistema */}
        <div className="bg-white/70 backdrop-blur-2xl p-7 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-6 relative overflow-hidden group transition-all duration-500">
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                <Activity size={24} strokeWidth={1.5} />
                {/* Indicador de estado integrado en el icono */}
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="relative z-10">
                <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-1">
                  Base de Datos
                </p>
                <p className="text-xl font-semibold text-gray-900 tracking-tight">
                  En Línea
                </p>
            </div>
        </div>

      </div>

      {/* SECCIÓN DEL GRÁFICO */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Actividad del Sistema
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  Registros procesados durante los últimos 6 meses.
                </p>
            </div>
            {/* Badge de estado estilo píldora */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-blue-50/80 backdrop-blur-sm text-blue-600 rounded-full border border-blue-100/50 text-xs font-semibold shadow-sm">
                <TrendingUp size={14} strokeWidth={2.5} />
                <span>Activo</span>
            </div>
        </div>
        
        {/* Gráfico */}
        <div className="relative w-full">
          <PostsChart data={stats.chartData} />
        </div>
      </div>

    </div>
  );
}