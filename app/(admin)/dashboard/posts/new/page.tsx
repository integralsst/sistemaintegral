"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, UploadCloud, Trash2, Check, Star, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import "react-quill-new/dist/quill.snow.css"; 

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false }) as any;

const AVAILABLE_TAGS = [
  "Psicología", "Psicoterapia", "Ansiedad", "Depresión", "Estrés",
  "Estres laboral", "Trauma", "SST", "Riesgo psicosocial en el trabajo", "Manizales"
];

export default function NewPostPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "", 
    excerpt: "",
    content: "",
    tags: [] as string[], 
    readTime: "",
    image: "",
    isFeatured: false 
  });

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'clean']
    ],
    clipboard: {
      matchVisual: false,
      matchers: [
        [1, (node: any, delta: any) => {
          delta.ops = delta.ops.map((op: any) => {
            if (!op.attributes) return op;
            const allowedAttributes = ['bold', 'italic', 'underline', 'strike', 'header', 'list', 'indent', 'link', 'align', 'blockquote'];
            const newAttributes: any = {};
            allowedAttributes.forEach(attr => {
              if (op.attributes[attr]) {
                newAttributes[attr] = op.attributes[attr];
              }
            });
            return { insert: op.insert, attributes: newAttributes };
          });
          return delta;
        }]
      ]
    }
  }), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "title") {
      const generatedSlug = value
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/[^a-z0-9]+/g, '-') 
        .replace(/(^-|-$)+/g, ''); 

      setFormData(prev => ({ ...prev, title: value, slug: generatedSlug }));
    } else if (name === "slug") {
      const safeSlug = value
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-]+/g, '') 
        .replace(/--+/g, '-');
      
      setFormData(prev => ({ ...prev, slug: safeSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditorChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => {
      const currentTags = prev.tags;
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "");
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const file = await res.json();
      if (file.secure_url) {
        setFormData((prev) => ({ ...prev, image: file.secure_url }));
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al subir imagen' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug) {
        Swal.fire({ icon: 'warning', title: 'Falta la URL', text: 'El slug es obligatorio para crear el artículo.' });
        return;
    }

    if (!formData.content || formData.content === "<p><br></p>") {
        Swal.fire({ icon: 'warning', title: 'Falta contenido', text: 'El contenido no puede estar vacío.' });
        return;
    }

    if (formData.tags.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Sin etiquetas', text: 'Selecciona al menos una etiqueta.' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        category: JSON.stringify(formData.tags) 
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      }

      await Swal.fire({
            icon: 'success',
            title: '¡Publicado!',
            text: 'Tu nuevo artículo ya está en línea.',
            confirmButtonColor: '#007AFF',
            confirmButtonText: 'Genial'
      });
      router.push("/dashboard/posts"); 
      router.refresh();

    } catch (error: any) {
      console.error(error);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error al guardar', 
        text: error.message || 'No se pudo crear el artículo.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6">
      
      {/* HEADER TIPO MAC OS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
            <Link href="/dashboard/posts" className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:text-black hover:shadow-md transition-all">
                <ArrowLeft size={18} />
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Nuevo Artículo</h1>
                <p className="text-gray-500 text-sm mt-0.5">Crea y comparte tu conocimiento</p>
            </div>
        </div>
        <div className="flex items-center">
            <button 
                onClick={handleSubmit} 
                disabled={loading || uploadingImage} 
                className="px-6 py-2.5 w-full sm:w-auto bg-black hover:bg-gray-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-medium text-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Publicar Artículo
            </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA PRINCIPAL */}
        <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-8">
                
                {/* Título */}
                <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Título principal</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Escribe un título llamativo..."
                        className="w-full text-3xl font-bold text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 p-0 bg-transparent"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Slug */}
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <LinkIcon size={14} className="text-gray-400" />
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Enlace Permanente (Slug)</label>
                    </div>
                    <input
                        type="text"
                        name="slug"
                        placeholder="ej: como-superar-la-ansiedad"
                        className="w-full text-sm font-mono text-blue-600 placeholder:text-gray-300 border-none focus:ring-0 p-0 bg-transparent"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                    />
                    <p className="text-[10px] text-gray-400 mt-2">Se auto-genera al escribir el título.</p>
                </div>

                {/* Resumen */}
                <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Resumen para la tarjeta</label>
                    <textarea
                        name="excerpt"
                        rows={3}
                        placeholder="Una breve introducción de 2 o 3 líneas..."
                        className="w-full text-gray-600 placeholder:text-gray-300 border-none focus:ring-0 p-0 bg-transparent resize-none leading-relaxed"
                        value={formData.excerpt}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {/* Editor de Texto */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[600px] flex flex-col">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-6">Cuerpo del artículo</label>
                <div className="flex-1 h-full editor-container">
                    <ReactQuill 
                        theme="snow" 
                        value={formData.content} 
                        onChange={handleEditorChange}
                        modules={modules}
                        placeholder="Comienza a escribir tu contenido aquí..."
                        className="h-full flex-1 mb-12 border-none" 
                    />
                </div>
            </div>
        </div>

        {/* COLUMNA LATERAL (SETTINGS) */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Tarjeta de Destacado (Estilo iOS Toggle) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div 
                    onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                    className="flex items-center justify-between cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl transition-colors ${formData.isFeatured ? "bg-amber-100 text-amber-500" : "bg-gray-100 text-gray-400"}`}>
                            <Star size={18} fill={formData.isFeatured ? "currentColor" : "none"} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Destacar Artículo</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">Fijar al inicio del blog</p>
                        </div>
                    </div>
                    {/* Toggle iOS */}
                    <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${formData.isFeatured ? "bg-[#34C759]" : "bg-gray-200"}`}>
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${formData.isFeatured ? "translate-x-6" : "translate-x-1"}`} />
                    </div>
                </div>
            </div>

            {/* Ajustes Generales */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-8">
                
                {/* Imagen */}
                <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Portada del artículo</label>
                    <div className="relative w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 flex flex-col items-center justify-center transition-all group">
                        {uploadingImage ? (
                            <div className="flex flex-col items-center text-blue-500">
                                <Loader2 className="animate-spin mb-2" />
                                <span className="text-xs font-medium">Subiendo...</span>
                            </div>
                        ) : formData.image ? (
                            <>
                                <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button type="button" onClick={() => setFormData({ ...formData, image: "" })} className="bg-white/90 p-2 rounded-full text-red-500 shadow-lg hover:scale-110 transition-transform">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="text-gray-300 mb-2 group-hover:text-blue-500 transition-colors" size={28} />
                                <span className="text-xs font-medium text-gray-400 group-hover:text-blue-500">Subir imagen</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </>
                        )}
                    </div>
                </div>

                {/* Etiquetas (Chips) */}
                <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        Etiquetas <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-1">{formData.tags.length}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.map((tag) => {
                            const isSelected = formData.tags.includes(tag);
                            return (
                                <button 
                                    key={tag} 
                                    type="button" 
                                    onClick={() => toggleTag(tag)} 
                                    className={`text-[11px] font-medium px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 border
                                        ${isSelected 
                                            ? "bg-blue-500 text-white border-blue-500 shadow-sm" 
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    {isSelected && <Check size={12} />} {tag}
                                </button>
                            );
                        })}
                    </div>
                    {formData.tags.length === 0 && <p className="text-[10px] text-red-400 mt-2">Selecciona al menos una etiqueta.</p>}
                </div>

                {/* Tiempo de lectura */}
                <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Tiempo de Lectura</label>
                    <input 
                        type="text" 
                        name="readTime" 
                        placeholder="Ej: 5 min"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        value={formData.readTime} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
            </div>
        </div>
      </form>
      
      {/* Estilos para limpiar Quill y hacerlo lucir nativo */}
      <style jsx global>{`
        .editor-container .ql-toolbar {
            border: none !important;
            border-bottom: 1px solid #f3f4f6 !important;
            border-radius: 1.5rem 1.5rem 0 0 !important;
            padding: 1rem !important;
            background: #fafafa;
        }
        .editor-container .ql-container {
            border: none !important;
            font-family: inherit !important;
            font-size: 1rem !important;
        }
        .editor-container .ql-editor {
            padding: 1.5rem 0 !important;
            color: #374151;
            min-height: 500px;
        }
        .editor-container .ql-editor::before {
            color: #d1d5db !important;
            font-style: normal !important;
        }
        .ql-editor .ql-align-justify { text-align: justify; text-justify: inter-word; }
        .ql-editor li.ql-align-justify { text-align: justify; }
        .ql-editor .ql-indent-1 { padding-left: 3em; }
        .ql-editor .ql-indent-2 { padding-left: 6em; }
        .ql-editor .ql-indent-3 { padding-left: 9em; }
      `}</style>
    </div>
  );
}