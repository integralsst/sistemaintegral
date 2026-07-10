"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, Loader2, UploadCloud, Check, Star, Trash2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import TiptapEditor from "@/app/components/admin/TiptapEditor"; // <-- Ajusta la ruta si es necesario

const AVAILABLE_TAGS = [
  "SG-SST", "Normativa", "Resolución 0312", "Decreto 1072", "Riesgos Laborales",
  "Salud Ocupacional", "Prevención", "Copasst", "Auditoría", "Bienestar Laboral"
];

const baseCustomClass = {
  popup: 'rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-xl border border-gray-100 p-6',
  title: 'text-xl font-semibold text-gray-900 tracking-tight mt-1',
  htmlContainer: 'text-sm text-gray-500 font-medium leading-relaxed mt-2',
  confirmButton: 'bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-xl px-8 py-3 font-medium transition-colors w-full sm:w-auto shadow-sm',
  cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl px-8 py-3 font-medium transition-colors w-full sm:w-auto',
  actions: 'flex gap-3 w-full justify-center mt-6',
};

const appleAlert = Swal.mixin({ customClass: baseCustomClass, buttonsStyling: false });

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "", slug: "", excerpt: "", content: "", tags: [] as string[], readTime: "", image: "", isFeatured: false 
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Error al cargar");
        const data = await res.json();
        
        let parsedTags: string[] = [];
        try {
            if (data.category && data.category.startsWith("[")) parsedTags = JSON.parse(data.category);
            else if (data.category) parsedTags = [data.category]; 
        } catch (e) { parsedTags = []; }

        setFormData({
            title: data.title || "", slug: data.slug || "", excerpt: data.excerpt || "", content: data.content || "",
            tags: Array.isArray(parsedTags) ? parsedTags : [], readTime: data.readTime || "", image: data.image || "", isFeatured: data.isFeatured || false
        });
      } catch (error) {
        appleAlert.fire({ icon: 'error', title: 'Error de carga', text: 'No se pudo cargar el artículo solicitado.', confirmButtonText: 'Volver' }).then(() => { router.push("/dashboard/posts"); });
      } finally {
        setFetching(false);
      }
    };
    if (params.id) fetchPost();
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => {
      const currentTags = prev.tags;
      if (currentTags.includes(tag)) return { ...prev, tags: currentTags.filter(t => t !== tag) };
      else return { ...prev, tags: [...currentTags, tag] };
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
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
      const fileData = await res.json();
      if (fileData.secure_url) setFormData((prev) => ({ ...prev, image: fileData.secure_url }));
    } catch (error) {
      appleAlert.fire({ icon: 'error', title: 'Error', text: 'Error al subir la imagen a la nube.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content || formData.content === "<p></p>") { appleAlert.fire({ icon: 'warning', title: 'Contenido Vacío', text: 'El cuerpo del artículo no puede estar vacío.' }); return; }
    setLoading(true);

    try {
      const payload = { ...formData, category: JSON.stringify(formData.tags) };
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const res = await fetch(`/api/posts/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      if (!res.ok) throw new Error("Error al actualizar");
      await appleAlert.fire({ icon: 'success', title: '¡Actualizado!', text: 'El artículo se guardó correctamente.', confirmButtonText: 'Continuar' });
      router.push("/dashboard/posts");
      router.refresh();
    } catch (error: any) {
      appleAlert.fire({ icon: 'error', title: 'Error de Servidor', text: 'No se pudo contactar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await appleAlert.fire({
        title: '¿Estás seguro?', text: "Esta acción es irreversible.", icon: 'warning', showCancelButton: true, confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar',
        customClass: { ...baseCustomClass, confirmButton: 'bg-[#FF3B30] hover:bg-[#D70015] text-white rounded-xl px-8 py-3 font-medium transition-colors w-full sm:w-auto shadow-sm', }
    });

    if (result.isConfirmed) {
        setDeleting(true);
        try {
            const id = Array.isArray(params.id) ? params.id[0] : params.id;
            const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error al eliminar");
            await appleAlert.fire({ icon: 'success', title: 'Eliminado', text: 'El artículo ha sido borrado del sistema.', confirmButtonText: 'Continuar' });
            router.push("/dashboard/posts");
            router.refresh();
        } catch (error) {
            appleAlert.fire({ icon: 'error', title: 'Error de servidor', text: 'No se pudo completar la eliminación.' });
            setDeleting(false);
        }
    }
  };

  if (fetching) return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-gray-400 gap-4"><Loader2 className="animate-spin" size={32} /><span className="text-sm font-medium tracking-wide">Cargando artículo...</span></div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6"> 
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
            <Link href="/dashboard/posts" className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:text-black hover:shadow-md transition-all"><ArrowLeft size={18} /></Link>
            <div><h1 className="text-3xl font-bold text-gray-900 tracking-tight">Editor</h1><p className="text-gray-500 text-sm mt-0.5">Modifica y actualiza tu contenido</p></div>
        </div>
        <div className="flex items-center gap-3">
            <button type="button" onClick={handleDelete} disabled={loading || uploadingImage || deleting} className="px-5 py-2.5 bg-white border border-red-100 text-red-500 rounded-xl hover:bg-red-50 font-medium text-sm transition-all shadow-sm flex items-center gap-2 disabled:opacity-50">
                {deleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />} Eliminar
            </button>
            <button onClick={handleSubmit} disabled={loading || uploadingImage || deleting} className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl shadow-md transition-all font-medium text-sm flex items-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Guardar Cambios
            </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-8">
                <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Título principal</label>
                    <input type="text" name="title" className="w-full text-3xl font-bold text-gray-900 border-none focus:ring-0 p-0 bg-transparent" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2"><LinkIcon size={14} className="text-gray-400" /><label className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Enlace Permanente (Slug)</label></div>
                    <input type="text" name="slug" className="w-full text-sm font-mono text-blue-600 border-none focus:ring-0 p-0 bg-transparent" value={formData.slug} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Resumen para la tarjeta</label>
                    <textarea name="excerpt" rows={3} className="w-full text-gray-600 border-none focus:ring-0 p-0 bg-transparent resize-none leading-relaxed" value={formData.excerpt} onChange={handleChange} required />
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] min-h-[760px] flex flex-col">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-6">Cuerpo del artículo</label>
                <div className="flex-1 min-h-[680px] h-full">
  <TiptapEditor value={formData.content} onChange={handleEditorChange} />
</div>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl transition-colors ${formData.isFeatured ? "bg-amber-100 text-amber-500" : "bg-gray-100 text-gray-400"}`}><Star size={18} fill={formData.isFeatured ? "currentColor" : "none"} /></div>
                        <div><p className="text-sm font-bold text-gray-900">Destacar Artículo</p></div>
                    </div>
                    <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${formData.isFeatured ? "bg-[#34C759]" : "bg-gray-200"}`}>
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${formData.isFeatured ? "translate-x-6" : "translate-x-1"}`} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-8">
                <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Portada del artículo</label>
                    <div className="relative w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 flex flex-col items-center justify-center transition-all group">
                        {uploadingImage ? (
                            <div className="flex flex-col items-center text-blue-500"><Loader2 className="animate-spin mb-2" /><span className="text-xs font-medium">Subiendo...</span></div>
                        ) : formData.image ? (
                            <><Image src={formData.image} alt="Preview" fill className="object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button type="button" onClick={() => setFormData({ ...formData, image: "" })} className="bg-white/90 p-2 rounded-full text-red-500 hover:scale-110 transition-transform"><Trash2 size={18} /></button>
                              </div>
                            </>
                        ) : (
                            <><UploadCloud className="text-gray-300 mb-2 group-hover:text-blue-500 transition-colors" size={28} /><span className="text-xs font-medium text-gray-400 group-hover:text-blue-500">Subir imagen</span>
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Etiquetas <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-1">{formData.tags.length}</span></label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.map((tag) => {
                            const isSelected = formData.tags.includes(tag);
                            return (
                                <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`text-[11px] font-medium px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 border ${isSelected ? "bg-blue-500 text-white border-blue-500 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                                    {isSelected && <Check size={12} />} {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Tiempo de Lectura</label>
                    <input type="text" name="readTime" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.readTime} onChange={handleChange} required />
                </div>
            </div>
        </div>
      </form>
    </div>
  );
}