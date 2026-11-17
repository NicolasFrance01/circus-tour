"use client";

import { useState } from "react";
import { UploadCloud, Image as ImageIcon, CheckCircle, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Imagen de portada / afiche",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al subir la imagen");
      }

      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... o subí un archivo abajo"
          className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Upload Dropzone */}
      <div className="relative border-2 border-dashed border-slate-300 hover:border-primary/60 rounded-2xl p-5 text-center transition-colors bg-slate-50/50">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs font-semibold text-slate-600">
                Subiendo a Vercel Blob Storage...
              </p>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-slate-400" />
              <p className="text-xs font-bold text-slate-700">
                Hacé clic o arrastrá una imagen aquí
              </p>
              <p className="text-[11px] text-slate-500">
                PNG, JPG, WEBP hasta 10MB (Almacenamiento Vercel Blob)
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-3 relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
          <img
            src={value}
            alt="Vista previa"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Imagen asignada</span>
          </div>
        </div>
      )}
    </div>
  );
}
