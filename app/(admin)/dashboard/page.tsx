import { FileText, TrendingUp, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma"; // Importación directa de la base de datos
import PostsChart from "../../components/admin/PostsChart"; 

// 1. Convertimos el componente en asíncrono para permitir consultas a la base de datos
export default async function AdminDashboard() {
  
  // 2. Consulta 1: Conteo total de artículos publicados
  const totalPostsCount = await prisma.post.count();

  // 3. Consulta 2: Obtener la actividad de los últimos 6 meses
  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
  sixMonthsAgo.setDate(1); // Normalizar al primer día del mes
  sixMonthsAgo.setHours(0, 0, 0, 0);

  // Traemos solo la fecha de creación para no saturar la memoria
  const recentPosts = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      createdAt: true,
    },
  });

  // 4. Lógica de agrupación: Construir el arreglo para el gráfico (últimos 6 meses)
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const dynamicChartData = [];

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setMonth(currentDate.getMonth() - i);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();
    
    // Filtramos cuántos artículos coinciden con este mes y año específico
    const monthlyCount = recentPosts.filter((post) => {
      const postDate = new Date(post.createdAt);
      return postDate.getMonth() === targetMonth && postDate.getFullYear() === targetYear;
    }).length;

    dynamicChartData.push({
      name: monthNames[targetMonth],
      posts: monthlyCount,
      month: targetMonth,
      year: targetYear,
    });
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700">
      
      {/* Cabecera - Contexto SST */}
      <header className="mb-10 px-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2 tracking-tight">
            Panel de Control SG-SST
        </h1>
        <p className="text-gray-500 text-sm md:text-base font-medium">
            Supervisión centralizada de registros, guías y normativa vigente.
        </p>
      </header>

      {/* GRID DE MÉTRICAS - Ajustado a 2 columnas tras eliminar la satisfacción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Card 1: Artículos Totales */}
        <div className="bg-white/70 backdrop-blur-2xl p-7 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-6 relative overflow-hidden group transition-all duration-500">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform duration-500">
            <FileText size={24} strokeWidth={1.5} />
          </div>
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-1">
              Documentación Publicada
            </p>
            <p className="text-4xl font-semibold text-gray-900 tracking-tight">
              {totalPostsCount}
            </p>
          </div>
          {/* Brillo sutil de fondo */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
        </div>

        {/* Card 2: Estado del Sistema */}
        <div className="bg-white/70 backdrop-blur-2xl p-7 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-6 relative overflow-hidden group transition-all duration-500">
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                <Activity size={24} strokeWidth={1.5} />
                {/* Indicador de estado integrado en el icono */}
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="relative z-10">
                <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-1">
                  Estado Operativo
                </p>
                <p className="text-xl font-semibold text-gray-900 tracking-tight">
                  Sistema en Línea
                </p>
            </div>
        </div>

      </div>

      {/* SECCIÓN DEL GRÁFICO */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Actividad de Publicaciones
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  Volumen de guías normativas registradas durante los últimos 6 meses.
                </p>
            </div>
            {/* Badge de estado estilo píldora */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-blue-50/80 backdrop-blur-sm text-blue-600 rounded-full border border-blue-100/50 text-xs font-semibold shadow-sm">
                <TrendingUp size={14} strokeWidth={2.5} />
                <span>Actualizado</span>
            </div>
        </div>
        
        {/* Gráfico conectado a los datos dinámicos */}
        <div className="relative w-full">
          <PostsChart data={dynamicChartData} />
        </div>
      </div>

    </div>
  );
}