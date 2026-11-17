"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import { Plus, Trash2, ArrowLeft, Save, Sparkles, AlertCircle } from "lucide-react";
import NextLink from "next/link";

interface PickupPointInput {
  name: string;
  address: string;
  time: string;
  extraPrice: number;
}

interface EventFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function EventForm({ initialData, isEditing }: EventFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [type, setType] = useState<"EVENTO" | "TURISMO">(initialData?.type || "EVENTO");
  const [categoryTag, setCategoryTag] = useState(initialData?.categoryTag || "Recitales");

  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().slice(0, 16)
      : new Date(Date.now() + 86400000 * 15).toISOString().slice(0, 16)
  );

  const [departureTime, setDepartureTime] = useState(initialData?.departureTime || "17:30");
  const [departureLocation, setDepartureLocation] = useState(
    initialData?.departureLocation || "Terminal de Córdoba"
  );
  const [venue, setVenue] = useState(initialData?.venue || "");
  const [city, setCity] = useState(initialData?.city || "Córdoba");
  const [destinationCity, setDestinationCity] = useState(
    initialData?.destinationCity || "Buenos Aires"
  );

  const [price, setPrice] = useState(initialData?.price ? Number(initialData.price.toString()) : 35000);
  const [depositPrice, setDepositPrice] = useState(
    initialData?.depositPrice ? Number(initialData.depositPrice.toString()) : 15000
  );
  const [totalCapacity, setTotalCapacity] = useState(initialData?.totalCapacity || 50);
  const [busType, setBusType] = useState(initialData?.busType || "Cama / Semicama");

  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ||
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80"
  );

  const [description, setDescription] = useState(initialData?.description || "");
  const [itinerary, setItinerary] = useState(initialData?.itinerary || "");

  // Includes list
  let defaultIncludes = [
    "Traslado ida y vuelta en micro de larga distancia",
    "Cena previa antes de ingresar",
    "Coordinación permanente todo el viaje",
    "Pasaje digital con código QR",
  ];
  if (initialData?.includes) {
    try {
      defaultIncludes = JSON.parse(initialData.includes);
    } catch {}
  }
  const [includes, setIncludes] = useState<string[]>(defaultIncludes);
  const [newIncludeText, setNewIncludeText] = useState("");

  // Pickup Points
  const [pickupPoints, setPickupPoints] = useState<PickupPointInput[]>(
    initialData?.pickupPoints && initialData.pickupPoints.length > 0
      ? initialData.pickupPoints.map((p: any) => ({
          name: p.name,
          address: p.address || "",
          time: p.time,
          extraPrice: Number(p.extraPrice) || 0,
        }))
      : [
          {
            name: "Terminal de Córdoba (Plataformas 1 a 5)",
            address: "Bv. Perón 380",
            time: "17:30",
            extraPrice: 0,
          },
        ]
  );

  const [isActive, setIsActive] = useState(
    initialData?.isActive !== undefined ? Boolean(initialData.isActive) : true
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured !== undefined ? Boolean(initialData.isFeatured) : false
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add / remove include
  const addInclude = () => {
    if (!newIncludeText.trim()) return;
    setIncludes([...includes, newIncludeText.trim()]);
    setNewIncludeText("");
  };

  const removeInclude = (index: number) => {
    setIncludes(includes.filter((_, i) => i !== index));
  };

  // Add / remove pickup point
  const addPickupPoint = () => {
    setPickupPoints([
      ...pickupPoints,
      { name: "Nuevo punto", address: "", time: "18:00", extraPrice: 0 },
    ]);
  };

  const updatePickupPoint = (index: number, field: keyof PickupPointInput, val: any) => {
    const updated = [...pickupPoints];
    updated[index] = { ...updated[index], [field]: val };
    setPickupPoints(updated);
  };

  const removePickupPoint = (index: number) => {
    setPickupPoints(pickupPoints.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title,
        subtitle,
        type,
        categoryTag,
        date,
        departureTime,
        departureLocation,
        venue,
        city,
        destinationCity,
        price,
        depositPrice: depositPrice || null,
        totalCapacity,
        busType,
        imageUrl,
        description,
        itinerary,
        includes,
        pickupPoints,
        isActive,
        isFeatured,
      };

      const url = isEditing
        ? `/api/admin/events/${initialData.id}`
        : "/api/admin/events";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al guardar el evento");
      }

      router.push(type === "TURISMO" ? "/admin/turismo" : "/admin/eventos");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <NextLink
            href={type === "TURISMO" ? "/admin/turismo" : "/admin/eventos"}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </NextLink>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isEditing ? `Editar: ${title}` : "Crear Nueva Salida"}
            </h1>
            <p className="text-xs text-slate-500">
              Completá la información del viaje para que los clientes puedan reservar.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-md hover-lift transition-all inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Guardando..." : "Guardar Salida"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          1. Información Principal
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Título del Evento / Show *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Milo J en el Kempes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Subtítulo / Estadio
            </label>
            <input
              type="text"
              placeholder="Ej: Estadio Kempes - Córdoba"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Tipo de salida
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="EVENTO">Evento / Recital</option>
              <option value="TURISMO">Turismo / Escapada</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Etiqueta de Categoría
            </label>
            <input
              type="text"
              placeholder="Ej: Recitales, Rock, Festivales"
              value={categoryTag}
              onChange={(e) => setCategoryTag(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Tipo de Micro / Unidad
            </label>
            <input
              type="text"
              placeholder="Ej: Cama / Semicama"
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Descripción de la salida *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Detalles del viaje, cena previa, comodidades y regreso..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Image Upload with Vercel Blob */}
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          label="Foto de portada / Flyer del show (Vercel Blob Storage)"
        />
      </div>

      {/* Date, Departure & Pricing Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          2. Fecha, Horarios & Precios
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Fecha y Hora del evento *
            </label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Horario de Salida
            </label>
            <input
              type="text"
              placeholder="Ej: 17:30"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Ciudad de Destino
            </label>
            <input
              type="text"
              placeholder="Ej: Buenos Aires o Córdoba"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Precio Total Pasaje (ARS) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Monto de Seña (opcional)
            </label>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={depositPrice}
              onChange={(e) => setDepositPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Capacidad Total (Butacas)
            </label>
            <input
              type="number"
              required
              min={1}
              value={totalCapacity}
              onChange={(e) => setTotalCapacity(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      {/* Pickup points Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              3. Puntos de Encuentro y Salida
            </h3>
            <p className="text-xs text-slate-500">
              Lugares donde los pasajeros pueden abordar el micro.
            </p>
          </div>
          <button
            type="button"
            onClick={addPickupPoint}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 inline-flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Punto</span>
          </button>
        </div>

        <div className="space-y-3">
          {pickupPoints.map((point, index) => (
            <div
              key={index}
              className="grid sm:grid-cols-12 gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 items-center"
            >
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Nombre punto (ej: Terminal de Córdoba)"
                  value={point.name}
                  onChange={(e) => updatePickupPoint(index, "name", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 font-semibold"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Dirección o parador"
                  value={point.address}
                  onChange={(e) => updatePickupPoint(index, "address", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Hora (17:30)"
                  value={point.time}
                  onChange={(e) => updatePickupPoint(index, "time", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 text-center font-bold"
                />
              </div>
              <div className="sm:col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => removePickupPoint(index)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Included & Itinerary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          4. Qué Incluye & Cronograma
        </h3>

        {/* Includes Tags */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Ítems Incluidos en el Pasaje
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: Cena previa, Seguro de viaje..."
              value={newIncludeText}
              onChange={(e) => setNewIncludeText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInclude();
                }
              }}
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
            />
            <button
              type="button"
              onClick={addInclude}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
            >
              Agregar
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {includes.map((inc, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
              >
                <span>{inc}</span>
                <button
                  type="button"
                  onClick={() => removeInclude(i)}
                  className="text-slate-400 hover:text-rose-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Cronograma sugerido / Itinerario (opcional)
          </label>
          <textarea
            rows={3}
            placeholder="17:30 - Salida Terminal&#10;19:00 - Cena previa en parador&#10;21:00 - Ingreso al show"
            value={itinerary}
            onChange={(e) => setItinerary(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span>Evento activo y publicado en la web</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span>Destacar en la portada</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-lg hover-lift transition-all inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Guardando..." : "Guardar y Publicar"}</span>
        </button>
      </div>
    </form>
  );
}
