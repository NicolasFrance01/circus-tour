"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { Save, CheckCircle2, AlertCircle, Building2, Phone, Palette, Globe } from "lucide-react";

export default function SettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || "Circus Tours");
  const [tagline, setTagline] = useState(initialData?.tagline || "Te llevamos y te traemos.");
  const [description, setDescription] = useState(initialData?.description || "");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [heroImage, setHeroImage] = useState(
    initialData?.heroImage ||
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=2000&q=80"
  );
  const [heroTitle, setHeroTitle] = useState(
    initialData?.heroTitle || "Viajá a los mejores recitales y eventos"
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    initialData?.heroSubtitle ||
      "Traslados grupales en micros de larga distancia con cena previa, coordinación permanente y pasaje digital con QR."
  );

  const [phone, setPhone] = useState(initialData?.phone || "5493516703575");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || "5493516703575");
  const [instagram, setInstagram] = useState(initialData?.instagram || "circustourscordoba");
  const [addressCity, setAddressCity] = useState(initialData?.addressCity || "Córdoba");
  const [mapsUrl, setMapsUrl] = useState(
    initialData?.mapsUrl ||
      "https://www.google.com/maps/search/?api=1&query=-32.022249%2C-63.969874"
  );

  const [primaryColor, setPrimaryColor] = useState(
    initialData?.primaryColor || "#a83832"
  );

  const [bankAlias, setBankAlias] = useState(initialData?.bankAlias || "CIRCUS.TOURS.MP");
  const [bankCbu, setBankCbu] = useState(initialData?.bankCbu || "");
  const [bankHolder, setBankHolder] = useState(initialData?.bankHolder || "Circus Tours SRL");

  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavedSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tagline,
          description,
          logoUrl,
          heroImage,
          heroTitle,
          heroSubtitle,
          phone,
          whatsapp,
          instagram,
          addressCity,
          mapsUrl,
          primaryColor,
          bankAlias,
          bankCbu,
          bankHolder,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar configuración");
      }

      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>¡Configuración guardada con éxito! Los cambios ya se reflejan en el sitio.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Brand & Identity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <span>Identidad de Marca & Textos</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nombre de la Agencia *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Eslogan / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Descripción Institucional (Footer y meta tags)
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Logo Upload with Vercel Blob */}
        <ImageUpload
          value={logoUrl}
          onChange={setLogoUrl}
          label="Logo de la empresa (Vercel Blob Storage o URL)"
        />

        {/* Color Picker */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-primary" />
            <span>Color Primario del Sitio</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300 p-1"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-32 rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono font-bold text-slate-900 uppercase"
            />
            <span
              className="text-xs px-3 py-1 rounded-full text-white font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              Vista Previa
            </span>
          </div>
        </div>
      </div>

      {/* Hero Home Config */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Portada de Inicio (Hero)
        </h3>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Título Principal en la Portada
          </label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Subtítulo en la Portada
          </label>
          <textarea
            rows={2}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <ImageUpload
          value={heroImage}
          onChange={setHeroImage}
          label="Foto de fondo de la portada (Vercel Blob Storage)"
        />
      </div>

      {/* Contact & Social Links */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" />
          <span>Canales de Contacto & Redes</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              WhatsApp (número con código)
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="5493516703575"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Teléfono para llamadas
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="5493516703575"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Usuario de Instagram
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="circustourscordoba"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Ciudad de Operación
            </label>
            <input
              type="text"
              value={addressCity}
              onChange={(e) => setAddressCity(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Enlace Google Maps
            </label>
            <input
              type="text"
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      {/* Bank details for payments */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <span>Datos Bancarios para Cobros (Señas y Transferencias)</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Alias Bancario / MercadoPago
            </label>
            <input
              type="text"
              value={bankAlias}
              onChange={(e) => setBankAlias(e.target.value)}
              placeholder="CIRCUS.TOURS.MP"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              CBU / CVU (22 dígitos)
            </label>
            <input
              type="text"
              value={bankCbu}
              onChange={(e) => setBankCbu(e.target.value)}
              placeholder="0000003100012345678901"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Titular de la Cuenta
            </label>
            <input
              type="text"
              value={bankHolder}
              onChange={(e) => setBankHolder(e.target.value)}
              placeholder="Circus Tours SRL"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-lg hover-lift transition-all inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Guardando cambios..." : "Guardar Toda la Configuración"}</span>
        </button>
      </div>
    </form>
  );
}
