import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Star } from "lucide-react";

export const revalidate = 0; 

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  const featuredPost = posts.find(post => post.isFeatured);
  const regularPosts = posts.filter(post => post.id !== featuredPost?.id);

  return (
    <div className="bg-[#F5F5F7] min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Blog y Actualidad.
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg font-medium">
            Artículos, novedades y guías profesionales sobre salud, bienestar y prevención en el entorno laboral.
          </p>
        </div>

        {/* ARTÍCULO DESTACADO */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug || featuredPost.id}`} className="group block focus:outline-none mb-12">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative aspect-video lg:aspect-auto min-h-[400px] bg-gray-50">
                {featuredPost.image ? (
                  <Image 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium">Sin Imagen</div>
                )}
                <span className="absolute top-6 left-6 bg-[#FF9500] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5 backdrop-blur-md">
                  <Star size={12} fill="currentColor" /> Destacado
                </span>
              </div>
              <div className="p-8 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-300"/> {new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-300"/> {featuredPost.readTime || "5 min"}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight group-hover:text-[#007AFF] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-500 line-clamp-3 mb-8 text-base font-medium leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="inline-flex items-center gap-2 text-[#007AFF] font-semibold text-sm">
                  Leer artículo completo 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* GRILLA REGULAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => {
            let tags: string[] = [];
            try { tags = JSON.parse(post.category); } catch { tags = [post.category]; }

            return (
              <Link key={post.id} href={`/blog/${post.slug || post.id}`} className="group block h-full focus:outline-none">
                <article className="h-full bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1">
                  <div className="relative h-56 bg-gray-50 border-b border-gray-50 overflow-hidden">
                    {post.image ? (
                      <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium">Sin Imagen</div>
                    )}
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 leading-snug tracking-tight group-hover:text-[#007AFF] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 font-medium leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <div className="text-[#007AFF] flex items-center gap-1.5">
                        Leer más <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-medium">
            No hay artículos publicados todavía.
          </div>
        )}

      </div>
    </div>
  );
}