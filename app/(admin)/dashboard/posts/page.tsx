"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, Loader2, Calendar, FileText, Search } from "lucide-react";
import Swal from "sweetalert2";

interface Post {
  id: number;
  title: string;
  category: string;
  createdAt: string;
}

// 1. Extraemos las clases base para evitar errores de tipado (TypeScript ts(2339))
const baseCustomClass = {
  popup: 'rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-xl border border-gray-100 p-6',
  title: 'text-xl font-semibold text-gray-900 tracking-tight mt-1',
  htmlContainer: 'text-sm text-gray-500 font-medium leading-relaxed mt-2',
  confirmButton: 'bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-xl px-8 py-3 font-medium transition-colors w-full sm:w-auto shadow-sm',
  cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl px-8 py-3 font-medium transition-colors w-full sm:w-auto',
  actions: 'flex gap-3 w-full justify-center mt-6',
};

// Configuración de SweetAlert2 con diseño Apple
const appleAlert = Swal.mixin({
  customClass: baseCustomClass,
  buttonsStyling: false,
});

export default function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts/list");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error cargando posts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await appleAlert.fire({
        title: '¿Eliminar artículo?',
        text: "Esta acción es irreversible y no podrás recuperarlo.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        // 2. Usamos el objeto baseCustomClass directamente
        customClass: {
            ...baseCustomClass,
            confirmButton: 'bg-[#FF3B30] hover:bg-[#D70015] text-white rounded-xl px-8 py-3 font-medium transition-colors w-full sm:w-auto shadow-sm',
        }
    });

    if (!result.isConfirmed) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        appleAlert.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el artículo de la base de datos.' });
      }
    } catch (error) {
      appleAlert.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo establecer conexión con el servidor.' });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col h-[60vh] w-full items-center justify-center text-gray-400 gap-3">
        <Loader2 className="animate-spin" size={32} /> 
        <p className="text-sm font-medium tracking-wide">Cargando tu biblioteca...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight mb-2">Mis Artículos</h1>
            <p className="text-gray-500 text-sm font-medium">Gestiona el contenido de SisRiesgos y mantén a tu audiencia informada.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Buscar artículo..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
            </div>
            <Link 
                href="/dashboard/posts/new" 
                className="bg-black text-white px-5 py-2.5 rounded-xl font-medium text-sm flex justify-center items-center gap-2 hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
            >
                <Plus size={18} /> Nuevo Artículo
            </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white/50 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="text-blue-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tu blog está vacío</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Empieza a compartir tu conocimiento en salud ocupacional. Crea tu primer artículo ahora.</p>
            <Link href="/dashboard/posts/new" className="bg-black text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-all shadow-md">
                Escribir el primer artículo
            </Link>
        </div>
      ) : (
        <div className="space-y-3">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-6">Título del Artículo</div>
                <div className="col-span-3">Categorías</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-1 text-right">Acciones</div>
            </div>

            {filteredPosts.map((post) => {
                let parsedTags: string[] = [];
                try { parsedTags = JSON.parse(post.category); } 
                catch { parsedTags = [post.category]; }

                return (
                    <div key={post.id} className="group bg-white rounded-2xl p-4 md:px-6 md:py-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-6 flex flex-col gap-1">
                            <h3 className="font-serif font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                {post.title}
                            </h3>
                            <div className="flex md:hidden items-center gap-1.5 text-xs text-gray-400 mt-1">
                                <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="md:col-span-3 flex flex-wrap gap-1.5">
                            {parsedTags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-blue-50/50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase tracking-wider rounded-lg whitespace-nowrap">
                                    {tag}
                                </span>
                            ))}
                            {parsedTags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-50 text-gray-500 border border-gray-100 text-[10px] font-bold rounded-lg">
                                    +{parsedTags.length - 3}
                                </span>
                            )}
                        </div>

                        <div className="hidden md:flex md:col-span-2 items-center gap-2 text-sm text-gray-500">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>

                        <div className="md:col-span-1 flex items-center justify-end gap-2 border-t md:border-none border-gray-50 pt-3 md:pt-0">
                            <ActionButtons 
                                id={post.id} 
                                isDeleting={deletingId === post.id} 
                                onDelete={() => handleDelete(post.id)} 
                            />
                        </div>
                    </div>
                );
            })}

            {filteredPosts.length === 0 && searchTerm !== "" && (
                <div className="text-center py-12 text-gray-400">
                    No se encontraron artículos con "{searchTerm}"
                </div>
            )}
        </div>
      )}
    </div>
  );
}

function ActionButtons({ id, isDeleting, onDelete }: { id: number, isDeleting: boolean, onDelete: () => void }) {
    return (
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <Link 
                href={`/dashboard/posts/${id}`} 
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow"
                title="Editar artículo"
            >
                <Edit2 size={16} />
            </Link>
            <button 
                onClick={onDelete}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50"
                title="Eliminar artículo"
            >
                {isDeleting ? <Loader2 size={16} className="animate-spin text-red-500"/> : <Trash2 size={16} />}
            </button>
        </div>
    );
}