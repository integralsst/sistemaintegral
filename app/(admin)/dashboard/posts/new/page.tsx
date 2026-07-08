"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, UploadCloud, X, Check, Star, Link as LinkIcon } from "lucide-react";
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
            confirmButtonColor: '#0d9488',
            confirmButtonText: 'Ir al listado'
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
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/posts" className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-500">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="text-2xl font-serif font-bold text-stone-800">Crear Nuevo Artículo</h1>
            <p className="text-stone-500 text-sm">Comparte tu conocimiento con el mundo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Título</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Título del artículo..."
                    className="w-full text-xl font-serif font-bold text-stone-800 placeholder:text-stone-300 border-none focus:ring-0 p-0"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon size={14} className="text-stone-400" />
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">URL del Artículo (Slug)</label>
                </div>
                <input
                    type="text"
                    name="slug"
                    placeholder="ej: como-superar-la-ansiedad"
                    className="w-full text-sm font-mono text-teal-700 placeholder:text-stone-300 border-none focus:ring-0 p-0"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                />
                <p className="text-[10px] text-stone-400 mt-2">Se auto-genera al escribir el título. Puedes editarlo manualmente.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Resumen (Texto plano)</label>
                <textarea
                    name="excerpt"
                    rows={3}
                    placeholder="Breve introducción para la tarjeta..."
                    className="w-full text-stone-600 placeholder:text-stone-300 border-none focus:ring-0 p-0 resize-none"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm min-h-[600px] flex flex-col resize-y overflow-hidden">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Contenido Principal</label>
                <div className="flex-1 h-full flex flex-col">
                    <ReactQuill 
                        theme="snow" 
                        value={formData.content} 
                        onChange={handleEditorChange}
                        modules={modules}
                        placeholder="Escribe aquí tu artículo completo..."
                        className="h-full flex-1 mb-12" 
                    />
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div 
                onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                formData.isFeatured ? "bg-amber-50 border-amber-200 shadow-sm" : "bg-white border-stone-200 hover:border-stone-300"
            }`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${formData.isFeatured ? "bg-amber-100 text-amber-600" : "bg-stone-100 text-stone-400"}`}>
                        <Star size={18} fill={formData.isFeatured ? "currentColor" : "none"} />
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${formData.isFeatured ? "text-amber-800" : "text-stone-600"}`}>Destacar Artículo</p>
                        <p className="text-[10px] text-stone-400">Aparecerá primero en el inicio</p>
                    </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isFeatured ? "bg-amber-500" : "bg-stone-300"}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.isFeatured ? "left-6" : "left-1"}`} />
                </div>
            </div>

            <button type="submit" disabled={loading || uploadingImage} className="w-full bg-stone-900 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Publicar
            </button>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Etiquetas ({formData.tags.length})</label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.map((tag) => {
                            const isSelected = formData.tags.includes(tag);
                            return (
                                <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${isSelected ? "bg-teal-600 text-white border-teal-600 shadow-md" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-teal-400"}`}>
                                    {isSelected && <Check size={12} />} {tag}
                                </button>
                            );
                        })}
                    </div>
                    {formData.tags.length === 0 && <p className="text-[10px] text-red-400 mt-2">Selecciona al menos una etiqueta.</p>}
                </div>
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Tiempo de Lectura</label>
                    <input type="text" name="readTime" placeholder="Ej: 5 min" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:border-teal-500" value={formData.readTime} onChange={handleChange} required />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Imagen Destacada</label>
                <div className="relative w-full aspect-video bg-stone-50 rounded-lg overflow-hidden border border-stone-200 border-dashed flex flex-col items-center justify-center group mb-4">
                    {uploadingImage ? (
                        <div className="flex flex-col items-center text-teal-600 animate-pulse"><Loader2 className="animate-spin mb-2" /><span className="text-xs font-bold">Subiendo...</span></div>
                    ) : formData.image ? (
                        <>
                            <Image src={formData.image} alt="Preview" fill className="object-cover" />
                            <button type="button" onClick={() => setFormData({ ...formData, image: "" })} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 shadow-sm hover:bg-white"><X size={16} /></button>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="text-stone-300 mb-2 group-hover:text-teal-500 transition-colors" size={32} />
                            <span className="text-xs text-stone-400 group-hover:text-stone-600">Clic para subir imagen</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </>
                    )}
                </div>
                <p className="text-[10px] text-stone-400 text-center">Formatos: JPG, PNG, WEBP.</p>
            </div>
        </div>
      </form>
      
      <style jsx global>{`
        .ql-editor .ql-align-justify { text-align: justify; text-justify: inter-word; }
        .ql-editor li.ql-align-justify { text-align: justify; }
        .ql-editor .ql-indent-1 { padding-left: 3em; }
        .ql-editor .ql-indent-2 { padding-left: 6em; }
        .ql-editor .ql-indent-3 { padding-left: 9em; }
      `}</style>
    </div>
  );
}