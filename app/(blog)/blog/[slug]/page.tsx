import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const revalidate = 60; 

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;

  // Busca por slug, o como fallback por ID si es un número (para evitar 404s en posts viejos)
  const post = await prisma.post.findFirst({
    where: {
      OR: [
        { slug: slug },
        ...(isNaN(Number(slug)) ? [] : [{ id: Number(slug) }])
      ]
    },
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
      
      {/* Cabecera Minimalista */}
      <div className="w-full bg-[#F5F5F7] border-b border-gray-200/50 pt-20 pb-16 mb-12">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-10">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, idx) => (
              <span key={idx} className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-gray-200/50 text-gray-700 rounded-lg">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium uppercase tracking-wider">
            <span className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> {new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /> {post.readTime || "5 min"} de lectura</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        
        {/* Imagen Principal */}
        {post.image && (
          <div className="relative w-full aspect-[21/9] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-16">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Resumen */}
        <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed mb-12">
          {post.excerpt}
        </p>

        {/* Cuerpo del Artículo (Tipografía optimizada) */}
        <div 
          className="prose prose-lg max-w-none text-gray-700 prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight prose-a:text-[#007AFF] prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}