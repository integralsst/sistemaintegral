import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// Forzar que no se cachee de forma estática permanente para ver los nuevos posts instalantes
export const revalidate = 0; 

export default async function BlogPage() {
  // Obtenemos todos los posts ordenados por fecha de creación
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Filtrar el post destacado si existe
  const featuredPost = posts.find(post => post.isFeatured);
  const regularPosts = posts.filter(post => post.id !== featuredPost?.id);

  return (
    <div className="bg-[#F5F5F7] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
            Blog y Actualidad
          </h1>
          <p className="text-stone-600 max-w-xl mx-auto text-base">
            Artículos, novedades y guías profesionales sobre salud, bienestar y prevención en el entorno laboral.
          </p>
        </div>

        {/* 1. ARTÍCULO DESTACADO (Si existe) */}
        {featuredPost && (
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/60 shadow-sm hover:shadow-md transition-all duration-300 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative aspect-video lg:aspect-auto min-h-[300px] bg-stone-100">
              {featuredPost.image ? (
                <Image 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
              )}
              <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Destacado
              </span>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
                <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock size={14}/> {featuredPost.readTime}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-4 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-stone-600 line-clamp-3 mb-6 text-sm md:text-base">
                {featuredPost.excerpt}
              </p>
              <Link 
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 text-teal-600 font-bold hover:text-teal-700 transition-colors group text-sm"
              >
                Leer artículo completo 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. GRILLA DE ARTÍCULOS REGULARES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => {
            let tags: string[] = [];
            try {
              tags = JSON.parse(post.category);
            } catch {
              tags = [post.category];
            }

            return (
              <article key={post.id} className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden flex flex-col hover:scale-[1.01] transition-all duration-300">
                <div className="relative aspect-video bg-stone-100">
                  {post.image && (
                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-2 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-stone-600 text-xs line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <Link href={`/blog/${post.slug}`} className="text-teal-600 font-bold hover:underline flex items-center gap-1">
                      Leer más <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            Próximamente se publicarán nuestros primeros artículos. ¡Mantente conectado!
          </div>
        )}

      </div>
    </div>
  );
}