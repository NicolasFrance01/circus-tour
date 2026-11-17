"use client";

import { MessageCircle, Instagram } from "lucide-react";

interface FloatingButtonsProps {
  whatsapp?: string;
  instagram?: string;
}

export default function FloatingButtons({
  whatsapp = "5493516703575",
  instagram = "circustourscordoba",
}: FloatingButtonsProps) {
  const cleanPhone = whatsapp.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;
  const instagramUrl = instagram.startsWith("http")
    ? instagram
    : `https://instagram.com/${instagram.replace("@", "")}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end"
      role="navigation"
      aria-label="Contacto rápido por redes"
    >
      {/* Instagram Button */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir Instagram"
        className="flex size-13 h-13 w-13 p-3 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg shadow-purple-950/20 hover:scale-110 hover:shadow-xl transition-transform"
      >
        <Instagram className="w-6 h-6" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir WhatsApp"
        className="flex size-14 h-14 w-14 p-3.5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/30 hover:scale-110 hover:shadow-xl transition-transform animate-pulse"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}

