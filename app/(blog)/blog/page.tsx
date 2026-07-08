import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, ArrowRight, Star } from "lucide-react";

export const revalidate = 0; 

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export default async function BlogIndex() {
  // Ordenar primero los destacados y luego los más recientes
  const posts = await prisma.post.findMany({
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  return (
    <main className="min-h-screen bg-[#F5F5F7] pb-24 pt-32 selection:bg-[#007AFF] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header (Apple Design con lenguaje SST y Normativo) */}
        <div className="mb-16">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-8 group font-medium text-sm">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Actualidad y Normativa SST.
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Recursos, guías prácticas y actualizaciones sobre el Sistema de Gestión de Seguridad y Salud en el Trabajo.
          </p>
        </div>

        {/* Grid de Artículos (Todas las tarjetas iguales, priorizando el destacado) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {posts.map((post) => {
            
            let tags: string[] = [];
            try {
                if (post.category && post.category.startsWith("[")) {
                    tags = JSON.parse(post.category);
                } else {
                    tags = [post.category || "General"];
                }
            } catch (e) {
                tags = ["General"];
            }

            const visibleTags = tags.slice(0, 2);

            return (
              <Link key={post.id} href={`/blog/${post.slug || post.id}`} className="group block h-full focus:outline-none">
                <article className={`h-full flex flex-col bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border relative hover:-translate-y-1 ${post.isFeatured ? 'border-[#FF9500]/30' : 'border-gray-100'}`}>
                  
                  <div className="relative h-56 overflow-hidden bg-gray-50 border-b border-gray-50">
                    {post.image ? (
                        <Image 
                        src={post.image} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium">Sin Imagen</div>
                    )}
                    
                    {/* Frosted Glass Tags */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[80%] z-20">
                        {visibleTags.map((tag, index) => (
                            <span key={index} className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-gray-900 shadow-sm uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                        
                        {tags.length > 2 && (
                            <span className="bg-black/70 backdrop-blur-md px-2 py-1.5 rounded-full text-[11px] font-bold text-white shadow-sm border border-white/10 uppercase tracking-wider">
                                +{tags.length - 2}
                            </span>
                        )}
                    </div>

                    {post.isFeatured && (
                         <span className="absolute top-4 right-4 z-20 bg-[#FF9500] text-white p-2 rounded-full shadow-md animate-in fade-in zoom-in duration-300" title="Artículo Destacado">
                            <Star size={14} fill="currentColor" />
                         </span>
                    )}

                  </div>
                  
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <div className="flex gap-4 text-xs text-gray-400 mb-4 font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-300" /> {formatDate(post.createdAt)}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-300" /> {post.readTime || "5 min"}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#007AFF] transition-colors tracking-tight leading-snug">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 font-medium leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mt-auto">
                        <div className="text-[#007AFF] flex items-center gap-1.5">
                            Leer artículo completo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}

          {posts.length === 0 && (
            <div className="col-span-full text-center py-24 bg-white rounded-[24px] border border-gray-200 border-dashed">
                <p className="text-gray-500 font-medium text-lg">Aún no hay artículos o guías normativas publicadas.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}