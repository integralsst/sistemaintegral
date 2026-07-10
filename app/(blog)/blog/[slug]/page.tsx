import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { prisma } from "@/lib/prisma";
import ShareArticleButton from "@/app/components/main/ui/ShareArticleButton";

export const revalidate = 60;

type PageParams = Promise<{ slug: string }>;

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getTags(category: string | null | undefined): string[] {
  if (!category) return ["General"];

  try {
    if (category.startsWith("[")) {
      const parsed = JSON.parse(category);
      return Array.isArray(parsed) ? parsed : ["General"];
    }

    return [category];
  } catch {
    return [category || "General"];
  }
}

function isValidImageSrc(src: string | null | undefined) {
  if (!src) return false;

  return src.startsWith("/") || src.startsWith("https://res.cloudinary.com/");
}

function sanitizePostContent(content: string) {
  const cleanContent = content
    .replace(/href=(["'])www\./g, "href=$1https://www.")
    .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');

  return sanitizeHtml(cleanContent, {
    allowedTags: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "blockquote",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "colgroup",
      "col",
      "br",
      "div",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "class", "style"],
      img: [
        "src",
        "alt",
        "title",
        "width",
        "height",
        "class",
        "style",
        "data-align",
        "data-width",
      ],
      div: ["class", "style", "data-align"],
      span: ["class", "style", "data-align"],
      p: ["class", "style", "data-align"],
      h1: ["class", "style", "data-align"],
      h2: ["class", "style", "data-align"],
      h3: ["class", "style", "data-align"],
      h4: ["class", "style", "data-align"],
      table: ["class", "style"],
      thead: ["class", "style"],
      tbody: ["class", "style"],
      tr: ["class", "style"],
      th: ["class", "style", "colspan", "rowspan"],
      td: ["class", "style", "colspan", "rowspan"],
      ul: ["class", "style"],
      ol: ["class", "style"],
      li: ["class", "style"],
      blockquote: ["class", "style"],
      colgroup: ["class", "style"],
      col: ["class", "style", "span", "width"],
    },
    allowedStyles: {
      "*": {
        "font-size": [
          /^12px$/,
          /^14px$/,
          /^16px$/,
          /^18px$/,
          /^20px$/,
          /^24px$/,
          /^28px$/,
          /^32px$/,
        ],
        "text-align": [/^left$/, /^center$/, /^right$/, /^justify$/],
        width: [/^\d{1,3}%$/, /^\d{1,4}px$/],
        height: [/^auto$/, /^\d{1,4}px$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}

export default async function PostDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { slug } = await params;

  const decodedSlug = safeDecode(slug);

  console.log("🔍 Buscando post con este valor exacto:", decodedSlug);

  const idNumber = Number(decodedSlug);
  const isNumericId = !Number.isNaN(idNumber);

  const post = await prisma.post.findFirst({
    where: {
      OR: [
        { slug: decodedSlug },
        ...(isNumericId ? [{ id: idNumber }] : []),
      ],
    },
  });

  if (!post) {
    console.log("❌ No se encontró ningún post en la BD con ese slug/id.");
    return notFound();
  }

  const formattedDate = post.createdAt
    ? new Intl.DateTimeFormat("es-CO", {
        dateStyle: "long",
      }).format(post.createdAt)
    : "Fecha no disponible";

  const rawContent =
    typeof post.content === "string" && post.content.trim().length > 0
      ? post.content
      : "<p>Este artículo no tiene contenido disponible.</p>";

  const safeHTML = sanitizePostContent(rawContent);

  const tags = getTags(post.category);
  const hasValidImage = isValidImageSrc(post.image);

  return (
    <article className="min-h-screen bg-[#F5F5F7] pb-24 font-sans selection:bg-[#007AFF] selection:text-white">
      <div className="relative w-full h-[60vh] min-h-[500px] bg-[#1D1D1F] overflow-hidden">
        {hasValidImage ? (
          <Image
            src={post.image as string}
            alt={post.title || "Imagen del artículo"}
            fill
            sizes="100vw"
            className="object-cover opacity-60 scale-105 animate-[subtle-zoom_20s_ease-in-out_infinite_alternate]"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1F] via-[#1D1D1F]/40 to-transparent flex flex-col justify-end pb-20 md:pb-32">
          <div className="max-w-4xl mx-auto px-6 w-full">
            <Link
              href="/blog"
              className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors text-xs font-semibold uppercase tracking-widest backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10"
            >
              <ArrowLeft size={16} className="mr-2" />
              Volver a los artículos
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-5">
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className="bg-[#007AFF] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm"
                  >
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
              {post.title || "Artículo sin título"}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-6 sm:p-10 md:p-16 border border-gray-100">
          {post.excerpt && (
            <div className="text-xl md:text-2xl text-[#86868B] font-medium mb-12 pb-8 border-b border-gray-100 leading-relaxed tracking-tight">
              {post.excerpt}
            </div>
          )}

          <div
            className="safe-content relative z-20 tiptap-output"
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          />

          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-20">
            <div className="flex items-center gap-2 text-[#86868B] font-medium text-sm">
              <Calendar size={18} className="text-gray-400" />
              <span>Publicado el {formattedDate}</span>
            </div>

            <ShareArticleButton
              title={post.title || "Artículo"}
              text={post.excerpt || ""}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes subtle-zoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.05);
          }
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
          color: #1D1D1F;
        }

        .safe-content ul,
        .safe-content ol {
          margin-bottom: 1.5rem;
          margin-top: 0.5rem;
          padding-left: 2rem;
        }

        .safe-content li {
          margin-bottom: 0.5rem;
        }

        .safe-content h1,
        .safe-content h2,
        .safe-content h3,
        .safe-content h4 {
          font-family: inherit;
          font-weight: 700;
          color: #1D1D1F;
          letter-spacing: -0.02em;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .safe-content h2 {
          font-size: 1.75rem;
        }

        .safe-content h3 {
          font-size: 1.35rem;
        }

        .safe-content h4 {
          font-size: 1.15rem;
        }

        .safe-content blockquote {
          border-left: 4px solid #007AFF;
          background: #F5F5F7;
          padding: 1.25rem 1.5rem;
          margin: 2rem 0;
          border-radius: 0 16px 16px 0;
          font-style: normal;
          font-weight: 500;
          color: #1D1D1F;
        }

        .safe-content img {
          max-width: 100%;
          height: auto;
          border-radius: 16px;
          margin: 2.5rem auto;
          display: block;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0;
        }

        .safe-content a {
          color: #007AFF !important;
          text-decoration: none !important;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .safe-content a:hover {
          color: #0056b3 !important;
          text-decoration: underline !important;
        }

        .safe-content strong,
        .safe-content b {
          font-weight: 600;
          color: #1D1D1F;
        }

        .tiptap-output table {
          width: 100%;
          border-collapse: collapse;
          margin: 2.5rem 0;
          font-size: 0.95rem;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 0 1px #E5E7EB;
          table-layout: fixed;
        }

        .tiptap-output th,
        .tiptap-output td {
          padding: 1rem;
          border: 1px solid #E5E7EB;
          word-break: break-word;
        }

        .tiptap-output th {
          background-color: #F9FAFB;
          font-weight: 600;
          color: #111827;
          text-align: left;
        }

        .tiptap-output tr:last-child td {
          border-bottom: none;
        }

        .tiptap-output [style*="text-align: right"] {
          text-align: right;
        }

        .tiptap-output [style*="text-align: center"] {
          text-align: center;
        }

        .tiptap-output [style*="text-align: justify"] {
          text-align: justify;
        }
          .safe-content::after {
  content: "";
  display: block;
  clear: both;
}

.safe-content span[style*="font-size"] {
  line-height: 1.6;
}

.safe-content img[data-align="left"] {
  margin-left: 0;
  margin-right: auto;
}

.safe-content img[data-align="center"] {
  margin-left: auto;
  margin-right: auto;
}

.safe-content img[data-align="right"] {
  margin-left: auto;
  margin-right: 0;
}

.safe-content img[data-align="left-wrap"] {
  float: left;
  width: 40%;
  margin: 0.5rem 1.5rem 1rem 0;
}

.safe-content img[data-align="right-wrap"] {
  float: right;
  width: 40%;
  margin: 0.5rem 0 1rem 1.5rem;
}

@media (max-width: 640px) {
  .safe-content img[data-align="left-wrap"],
  .safe-content img[data-align="right-wrap"] {
    float: none;
    width: 100% !important;
    margin: 1.5rem auto;
  }
}
      `}</style>
    </article>
  );
}