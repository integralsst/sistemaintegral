import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ShareArticleButton from "@/app/components/main/ui/ShareArticleButton"; // Ajusta esta ruta si es necesario

export const revalidate = 60; 

type Params = Promise<{ slug: string }>;

export default async function PostDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  // Conexión directa a BD: Busca por slug, o como fallback por ID
  const post = await prisma.post.findFirst({
    where: {
      OR: [
        { slug: slug },
        ...(isNaN(Number(slug)) ? [] : [{ id: Number(slug) }])
      ]
    },
  });

  if (!post) return notFound();

  const formattedDate = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long'
  }).format(post.createdAt);

  const cleanContent = post.content
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/href=(["'])www\./g, 'href=$1https://www.')
    .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');

  let tags: string[] = [];
  try {
    if (post.category && post.category.startsWith("[")) {
        tags = JSON.parse(post.category);
    } else {
        tags = [post.category || "General"];
    }
  } catch (e) {
    tags = [post.category || "General"];
  }

  return (
    <article className="min-h-screen bg-[#F5F5F7] pb-24 font-sans selection:bg-[#007AFF] selection:text-white">
      
      {/* HERO SECTION (Estilo Apple News) */}
      <div className="relative w-full h-[60vh] min-h-[500px] bg-[#1D1D1F] overflow-hidden">
        {post.image ? (
            <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover opacity-60 scale-105 animate-[subtle-zoom_20s_ease-in-out_infinite_alternate]"
                priority
            />
        ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black"></div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1F] via-[#1D1D1F]/40 to-transparent flex flex-col justify-end pb-20 md:pb-32">
            <div className="max-w-4xl mx-auto px-6 w-full">
                <Link href="/blog" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors text-xs font-semibold uppercase tracking-widest backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10">
                    <ArrowLeft size={16} className="mr-2" />
                    Volver a los artículos
                </Link>
                
                <div className="flex flex-wrap items-center gap-4 mb-5">
                    <div className="flex gap-2 flex-wrap">
                        {tags.map((tag, i) => (
                            <span key={i} className="bg-[#007AFF] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <span className="flex items-center gap-2 text-gray-300 text-[11px] font-semibold uppercase tracking-wider pl-4 border-l border-gray-500/50">
                        <Clock size={14} className="text-gray-400" /> 
                        {post.readTime || "5 min"} de lectura
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-lg">
                    {post.title}
                </h1>
            </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-6 sm:p-10 md:p-16 border border-gray-100">
            
            {post.excerpt && (
                <div className="text-xl md:text-2xl text-[#86868B] font-medium mb-12 pb-8 border-b border-gray-100 leading-relaxed tracking-tight">
                    {post.excerpt}
                </div>
            )}
            
            <div 
                className="safe-content relative z-20" 
                dangerouslySetInnerHTML={{ __html: cleanContent }} 
            />

            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-20">
                <div className="flex items-center gap-2 text-[#86868B] font-medium text-sm">
                    <Calendar size={18} className="text-gray-400"/>
                    <span>Publicado el {formattedDate}</span>
                </div>
                
                {/* BOTÓN COMPARTIR AISLADO */}
                <ShareArticleButton title={post.title} text={post.excerpt} />
            </div>
        </div>
      </div>

      <style>{`
        @keyframes subtle-zoom {
            from { transform: scale(1); }
            to { transform: scale(1.05); }
        }

        .safe-content {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 1.1875rem; 
            line-height: 1.6; 
            color: #1D1D1F;
            width: 100%;
            -webkit-font-smoothing: antialiased;
        }

        .safe-content * {
            word-break: normal !important;
            overflow-wrap: break-word !important;
            white-space: normal !important; 
        }

        .safe-content p { 
            margin-bottom: 1.25rem !important; 
            min-height: 1.2rem; 
            text-align: left !important;
            color: #1D1D1F;
        }

        .safe-content .ql-indent-1 { padding-left: 2rem !important; }
        .safe-content .ql-indent-2 { padding-left: 4rem !important; }
        .safe-content .ql-indent-3 { padding-left: 6rem !important; }

        .safe-content ul, .safe-content ol {
            margin-bottom: 1.5rem;
            margin-top: 0.5rem;
        }

        .safe-content ul, .safe-content ol, .safe-content li {
            list-style: none !important; margin: 0; padding: 0;
        }

        .safe-content li {
            position: relative; margin-bottom: 0.5rem; padding-left: 1.5rem !important; text-align: left !important;
        }

        .safe-content li.ql-indent-1 { padding-left: 3.5rem !important; }
        .safe-content li.ql-indent-2 { padding-left: 5.5rem !important; }

        .safe-content ol { counter-reset: list-counter; }
        .safe-content ol > li { counter-increment: list-counter; }
        .safe-content ol > li::before {
            content: counter(list-counter) ".";
            position: absolute; left: 0; top: 0; width: 1.5rem; 
            text-align: left; color: #86868B; font-weight: 600; font-size: 1rem;
        }

        .safe-content ul > li::before {
            content: '•'; position: absolute; left: 0; top: -2px;
            color: #007AFF; font-size: 1.5em; font-weight: bold;
        }
        .safe-content li.ql-indent-1::before { content: '◦' !important; font-weight: 600; color: #86868B; }

        .safe-content li:has(> ol), .safe-content li:has(> ul) {
            padding-left: 0 !important; margin-bottom: 0 !important;
        }
        .safe-content li:has(> ol)::before, .safe-content li:has(> ul)::before {
            content: none !important; counter-increment: none !important; 
        }

        .safe-content h1, .safe-content h2, .safe-content h3 {
            font-family: inherit; font-weight: 700; color: #1D1D1F; letter-spacing: -0.02em;
            margin-top: 2.5rem; margin-bottom: 1rem; line-height: 1.2; text-align: left !important;
        }
        
        .safe-content h2 { font-size: 1.75rem; }
        .safe-content h3 { font-size: 1.35rem; }

        .safe-content blockquote {
            border-left: 4px solid #007AFF; background: #F5F5F7;
            padding: 1.25rem 1.5rem; margin: 2rem 0; border-radius: 0 16px 16px 0;
            font-style: normal; font-weight: 500; color: #1D1D1F;
        }

        .safe-content img {
            max-width: 100%; height: auto; border-radius: 16px; margin: 2rem 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #f0f0f0;
        }

        .safe-content a {
            color: #007AFF !important; text-decoration: none !important; font-weight: 500;
            transition: color 0.2s ease;
        }
        .safe-content a:hover {
            color: #0056b3 !important; text-decoration: underline !important;
        }
        
        .safe-content strong, .safe-content b { font-weight: 600; color: #1D1D1F; }
        .safe-content .ql-align-center { text-align: center !important; }
        .safe-content .ql-align-right { text-align: right !important; }
        .safe-content .ql-align-justify { text-align: justify !important; }
      `}</style>
    </article>
  );
}