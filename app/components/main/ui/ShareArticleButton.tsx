"use client";

import { Share } from "lucide-react";

interface Props {
  title: string;
  text: string;
}

export default function ShareArticleButton({ title, text }: Props) {
  const handleShare = async () => {
    const shareData = {
      title: title,
      text: text,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error al compartir:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    <button 
        onClick={handleShare}
        className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-[#007AFF] font-medium text-sm rounded-full transition-colors active:scale-95 border border-gray-200"
    >
        <Share size={16} />
        Compartir Artículo
    </button>
  );
}