import { FileText, TrendingUp, Activity } from "lucide-react";
import ReviewWidget from "../../components/admin/ReviewWidget"; 
import PostsChart from "../../components/admin/PostsChart"; 

export default function AdminDashboard() {
  
  // Datos estáticos (Mock Data) para reemplazar la base de datos temporalmente
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
    <div className="animate-in fade-in duration-700">
      
      {/* Cabecera */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Panel de Control
        </h1>
        <p className="text-gray-500 text-lg">
            Gestiona la plataforma y visualiza las métricas del sistema.
        </p>
      </header>

      {/* GRID DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Artículos Totales */}
        <div className="bg-white p-7 rounded-3xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <FileText size={28} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-1">Total Registros</p>
            <p className="text-4xl font-bold text-gray-800">{stats.postsCount}</p>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        </div>

        {/* Card 2: Widget Dinámico */}
        <div className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden border border-gray-200/60 hover:border-gray-300/60 transition-colors bg-white">
            <ReviewWidget initialCount={stats.reviewCount} />
        </div>

        {/* Card 3: Estado del Sistema */}
        <div className="bg-white p-7 rounded-3xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6 relative overflow-hidden">
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                <Activity size={28} strokeWidth={1.5} />
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_#22c55e]"></div>
            </div>
            <div className="relative z-10">
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-1">Base de Datos</p>
                <p className="text-xl font-bold text-gray-700">En Línea</p>
            </div>
        </div>

      </div>

      {/* SECCIÓN DEL GRÁFICO */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Actividad del Sistema</h2>
                <p className="text-sm text-gray-500 mt-1">Registros procesados durante los últimos 6 meses.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                <TrendingUp size={14} />
                <span>Activo</span>
            </div>
        </div>
        
        {/* Renderizamos el Gráfico Cliente con datos de prueba */}
        <PostsChart data={stats.chartData} />
      </div>

    </div>
  );
}