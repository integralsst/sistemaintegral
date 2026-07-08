"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, Loader2, Calendar, Tag } from "lucide-react";

interface Post {
  id: number;
  title: string;
  category: string;
  createdAt: string;
}

export default function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
    if (!confirm("¿Estás seguro de borrar este artículo? No se puede deshacer.")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex h-64 w-full items-center justify-center text-stone-500">
        <Loader2 className="animate-spin mr-2" /> Cargando tus escritos...
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-serif font-bold text-stone-800">Mis Artículos</h1>
            <p className="text-stone-500 text-sm">Administra tu biblioteca de contenido</p>
        </div>
        <Link 
            href="/dashboard/posts/new" 
            className="bg-stone-900 text-white px-4 py-3 sm:py-2 rounded-lg font-bold text-sm flex justify-center items-center gap-2 hover:bg-teal-600 transition-colors shadow-sm w-full sm:w-auto"
        >
            <Plus size={18} /> Nuevo Artículo
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {posts.length === 0 ? (
            <div className="p-10 text-center">
                <p className="text-stone-400 mb-4">Aún no has escrito ningún artículo.</p>
                <Link href="/dashboard/posts/new" className="text-teal-600 font-bold hover:underline">¡Escribe el primero!</Link>
            </div>
        ) : (
            <>
                <table className="hidden md:table w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Título</th>
                            <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Categoría</th>
                            <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Fecha</th>
                            <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-stone-50/50 transition-colors">
                                <td className="p-4 font-medium text-stone-800">{post.title}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100">
                                        {post.category}
                                    </span>
                                </td>
                                <td className="p-4 text-stone-500 text-sm">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <ActionButtons 
                                            id={post.id} 
                                            isDeleting={deletingId === post.id} 
                                            onDelete={() => handleDelete(post.id)} 
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="md:hidden divide-y divide-stone-100">
                    {posts.map((post) => (
                        <div key={post.id} className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-start text-xs text-stone-500">
                                <span className="px-2 py-1 bg-teal-50 text-teal-700 font-bold rounded-full border border-teal-100 flex items-center gap-1">
                                   <Tag size={10} /> {post.category}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="font-serif font-bold text-lg text-stone-800 leading-tight">
                                {post.title}
                            </h3>
                            <div className="pt-2 flex gap-3 border-t border-stone-50 mt-1">
                                <Link 
                                    href={`/dashboard/posts/${post.id}`} 
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50 active:bg-stone-100"
                                >
                                    <Edit2 size={16} /> Editar
                                </Link>
                                <button 
                                    onClick={() => handleDelete(post.id)}
                                    disabled={deletingId === post.id}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-red-100 text-red-600 font-medium text-sm bg-red-50 hover:bg-red-100 active:bg-red-200 disabled:opacity-50"
                                >
                                    {deletingId === post.id ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />} 
                                    Borrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
}

function ActionButtons({ id, isDeleting, onDelete }: { id: number, isDeleting: boolean, onDelete: () => void }) {
    return (
        <>
            <Link 
                href={`/dashboard/posts/${id}`} 
                className="p-2 text-stone-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
            >
                <Edit2 size={16} />
            </Link>
            <button 
                onClick={onDelete}
                disabled={isDeleting}
                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            >
                {isDeleting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
            </button>
        </>
    );
}