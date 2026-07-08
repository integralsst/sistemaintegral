import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const revalidate = 60; // Revalida cada minuto para optimizar rendimiento

interface Props {
  params: { slug: string };
}

export default async function PostDetailPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    notFound();
  }

  let tags: string[] = [];
  try {
    tags = JSON.parse(post.category);
  } catch {
    tags = [post.category];
  }

  return (
    <article className="min-h-screen bg-white pb-24">
      {/* Cabecera / Hero Imagen */}
      <div className="w-full bg-stone-50 border-b border-stone-200/60 py-8 mb-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors mb-6">
            <ArrowLeft size={14} /> Volver al blog
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-md">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-stone-500">
            <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><Clock size={16} /> Tiempo de lectura: {post.readTime}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {post.image && (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-sm border border-stone-100 mb-12">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Resumen / Introducción */}
        <p className="text-lg md:text-xl text-stone-600 font-serif italic border-l-4 border-teal-500 pl-4 mb-10 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Contenido Principal Renderizado (Estilos enriquecidos) */}
        <div 
          className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed text-stone-800 markdown-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Estilos globales básicos para asegurar que las alineaciones y justificados de Quill se respeten en producción */}
      <style jsx global>{`
        .markdown-body .ql-align-justify { text-align: justify; text-justify: inter-word; }
        .markdown-body .ql-align-center { text-align: center; }
        .markdown-body .ql-align-right { text-align: right; }
        .markdown-body ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .markdown-body ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .markdown-body p { margin-bottom: 1.25rem; font-size: 1.05rem; line-height: 1.75; }
        .markdown-body h2 { font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; color: #1c1917; }
        .markdown-body h3 { font-size: 1.4rem; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1c1917; }
      `}</style>
    </article>
  );
}