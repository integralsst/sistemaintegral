"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, Clock, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Post {
  id: number;
  slug: string | null;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  createdAt: string;
  isFeatured: boolean;
}

const CarouselSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className={`h-[480px] rounded-[24px] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse ${i === 3 ? 'hidden lg:block' : ''} ${i === 2 ? 'hidden md:block' : ''}`}>
        <div className="h-56 bg-gray-100 rounded-t-[24px]" />
        <div className="p-8 space-y-4">
          <div className="h-4 bg-gray-100 rounded-full w-1/3 mb-6" />
          <div className="h-6 bg-gray-100 rounded-full w-full" />
          <div className="h-6 bg-gray-100 rounded-full w-4/5" />
          <div className="h-20 bg-gray-50 rounded-xl w-full mt-6" />
        </div>
      </div>
    ))}
  </div>
);

export default function BlogCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/posts/list', { signal: controller.signal })
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
            // Ordenamiento estructurado: destacados primero, luego el resto
            const sortedPosts = data.sort((a, b) => {
                if (a.isFeatured && !b.isFeatured) return -1;
                if (!a.isFeatured && b.isFeatured) return 1;
                return 0;
            });
            setPosts(sortedPosts);
        }
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
            console.error("Error al cargar posts:", err);
            setLoading(false);
        }
      });

      return () => controller.abort();
  }, []);

  const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('es-CO', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    } catch (e) {
        return "";
    }
  };

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-24 bg-[#F5F5F7] w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* HEADER PREMIUM */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
              Últimos Artículos.
            </h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Descubre recursos, guías y reflexiones sobre bienestar y salud ocupacional.
            </p>
          </div>

          {/* CONTROLES ESTILO IOS */}
          <div className="flex gap-3 hidden md:flex">
            <button 
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/50 flex items-center justify-center text-gray-600 hover:text-black hover:scale-105 transition-all duration-300 shadow-sm hover:shadow active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => swiperRef.current?.slideNext()}
              className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/50 flex items-center justify-center text-gray-600 hover:text-black hover:scale-105 transition-all duration-300 shadow-sm hover:shadow active:scale-95"
              aria-label="Siguiente"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* CAROUSEL */}
        <div className="w-full relative">
            {loading ? (
                <CarouselSkeleton />
            ) : (
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    spaceBetween={32}
                    slidesPerView={1}
                    speed={800} 
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    loop={posts.length > 3}
                    className="!pb-16 !pt-4 px-2 -mx-2 w-full" 
                >
                {posts.map((post: Post) => {
                    
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
                        <SwiperSlide key={post.id} className="h-auto">
                            {/* ENLACE ENVOLVENTE COMPLETO */}
                            <Link href={`/blog/${post.slug || post.id}`} className="group block h-full focus:outline-none">
                                <article className={`h-full flex flex-col bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border relative hover:-translate-y-1 ${post.isFeatured ? 'border-[#FF9500]/30' : 'border-gray-100'}`}>
                                    
                                    {/* CONTENEDOR DE IMAGEN */}
                                    <div className="relative h-56 overflow-hidden bg-gray-50 border-b border-gray-50">
                                        {post.image ? (
                                            <Image 
                                                src={post.image} 
                                                alt={post.title} 
                                                fill 
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium">Sin Imagen</div>
                                        )}

                                        {/* ETIQUETAS FLOTANTES (FROSTED GLASS) */}
                                        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-[80%]">
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

                                        {/* ESTRELLA DE DESTACADO */}
                                        {post.isFeatured && (
                                            <span className="absolute top-4 right-4 z-20 bg-[#FF9500] text-white p-2 rounded-full shadow-md animate-in fade-in zoom-in duration-300" title="Artículo Destacado">
                                                <Star size={14} fill="currentColor" />
                                            </span>
                                        )}
                                    </div>

                                    {/* CONTENIDO DE LA TARJETA */}
                                    <div className="flex flex-col flex-1 p-6 sm:p-8">
                                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-semibold uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-300" />
                                                {formatDate(post.createdAt)}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-gray-300" />
                                                {post.readTime || "5 min"}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#007AFF] transition-colors line-clamp-2 leading-snug tracking-tight">
                                            {post.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-1 font-medium">
                                            {post.excerpt}
                                        </p>

                                        {/* BOTÓN FANTASMA TIPO IOS */}
                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mt-auto">
                                            <div className="text-[#007AFF] flex items-center gap-1.5">
                                                Leer artículo
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </SwiperSlide>
                    );
                })}
                </Swiper>
            )}
        </div>

        {/* BOTÓN VER TODOS */}
        <div className="mt-4 flex justify-center">
            <Link 
                href="/blog" 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
                Explorar todos los artículos
            </Link>
        </div>

      </div>
    </section>
  );
}