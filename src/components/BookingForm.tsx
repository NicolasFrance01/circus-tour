"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Building2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PickupPoint {
  id: string;
  name: string;
  address?: string | null;
  time: string;
  extraPrice: number | string | { toString: () => string };
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  price: number | string | { toString: () => string };
  depositPrice?: number | string | { toString: () => string } | null;
  busType?: string;
  pickupPoints: PickupPoint[];
}

interface BusinessInfo {
  bankAlias?: string | null;
  bankCbu?: string | null;
  bankHolder?: string | null;
  whatsapp?: string | null;
}

interface BookingFormProps {
  event: EventData;
  businessInfo?: BusinessInfo;
}

export default function BookingForm({ event, businessInfo }: BookingFormProps) {
  const router = useRouter();

  // Form State
  const [seatsCount, setSeatsCount] = useState<number>(1);
  const [seatType, setSeatType] = useState<string>("Semicama");
  const [pickupPointId, setPickupPointId] = useState<string>(
    event.pickupPoints[0]?.id || ""
  );

  const [customerName, setCustomerName] = useState("");
  const [customerDni, setCustomerDni] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFERENCIA" | "MERCADOPAGO" | "EFECTIVO">("TRANSFERENCIA");

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTicket, setSuccessTicket] = useState<{
    code: string;
    customerName: string;
    seatsCount: number;
    total: number;
  } | null>(null);

  const [copiedAlias, setCopiedAlias] = useState(false);

  // Price calculation
  const basePrice = Number(event.price.toString());
  const selectedPickup = event.pickupPoints.find((p) => p.id === pickupPointId);
  const extraPrice = selectedPickup ? Number(selectedPickup.extraPrice.toString()) : 0;
  const unitPrice = basePrice + extraPrice;
  const totalPrice = unitPrice * seatsCount;

  const depositPrice = event.depositPrice
    ? Number(event.depositPrice.toString()) * seatsCount
    : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName || !customerDni || !customerEmail || !customerPhone) {
      setError("Por favor completá todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          pickupPointId: pickupPointId || null,
          seatsCount,
          seatType,
          customerName,
          customerDni,
          customerEmail,
          customerPhone,
          notes,
          paymentMethod,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al procesar tu reserva.");
      }

      setSuccessTicket({
        code: data.ticketCode,
        customerName: data.customerName,
        seatsCount: data.seatsCount,
        total: totalPrice,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (successTicket) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            ¡Reserva confirmada con éxito!
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900">
            Tu lugar ya está reservado
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            ¡Hola <strong>{successTicket.customerName}</strong>! Generamos tu pasaje con código de embarque:
          </p>
        </div>

        {/* Ticket Code Box */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 max-w-sm mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Código de Pasaje
          </p>
          <p className="text-3xl font-black tracking-wider text-primary-ink mt-1 font-mono">
            {successTicket.code}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {successTicket.seatsCount} lugar(es) · Total: {formatPrice(successTicket.total)}
          </p>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1 max-w-md mx-auto">
          <p className="font-bold">📱 Siguiente paso:</p>
          <p>
            Podés ver tu pasaje digital con código QR para mostrar al subir al micro. También te enviamos el comprobante y los datos de contacto a tu WhatsApp.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => router.push(`/pasaje/${successTicket.code}`)}
            className="px-6 py-3 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md hover-lift transition-all inline-flex items-center justify-center gap-2"
          >
            <span>Ver mi Pasaje Digital con QR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6"
    >
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Reservar tu lugar
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Completá el formulario para asegurar tus pasajes de forma online.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Seats & Pickup Point */}
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Seats Count */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Cantidad de pasajes
            </label>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <select
                value={seatsCount}
                onChange={(e) => setSeatsCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "pasaje" : "pasajes"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seat Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Tipo de butaca
            </label>
            <select
              value={seatType}
              onChange={(e) => setSeatType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="Semicama">Semicama Premium</option>
              <option value="Cama">Cama Ejecutivo (piso inferior)</option>
            </select>
          </div>
        </div>

        {/* Pickup point selector */}
        {event.pickupPoints && event.pickupPoints.length > 0 && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Punto de encuentro y partida
            </label>
            <div className="space-y-2">
              {event.pickupPoints.map((point) => (
                <label
                  key={point.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    pickupPointId === point.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="pickupPoint"
                    value={point.id}
                    checked={pickupPointId === point.id}
                    onChange={(e) => setPickupPointId(e.target.value)}
                    className="mt-1 accent-primary"
                  />
                  <div className="min-w-0 text-sm">
                    <p className="font-bold text-slate-900">{point.name}</p>
                    {point.address && (
                      <p className="text-xs text-slate-500">{point.address}</p>
                    )}
                    <span className="inline-block mt-1 text-xs font-semibold text-primary-ink bg-primary/10 px-2 py-0.5 rounded-md">
                      Hora de encuentro: {point.time} hs
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Passenger Details */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Datos del titular de la reserva
        </h4>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nombre y Apellido *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Sofía Martínez"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              DNI / Pasaporte *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: 38123456"
              value={customerDni}
              onChange={(e) => setCustomerDni(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              WhatsApp / Teléfono *
            </label>
            <input
              type="tel"
              required
              placeholder="Ej: 351 670-3575"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              placeholder="Ej: sofia@gmail.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Comentarios o requerimientos especiales (opcional)
          </label>
          <textarea
            rows={2}
            placeholder="Si viajas con amigos para ir juntos en el micro, o menú vegetariano para la cena previa..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>
      </div>

      {/* Step 3: Payment Method */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Forma de Pago
        </h4>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "TRANSFERENCIA", label: "Transferencia", desc: "CBU / Alias" },
            { id: "MERCADOPAGO", label: "Mercado Pago", desc: "Débito / Crédito" },
            { id: "EFECTIVO", label: "Efectivo", desc: "En punto Circus" },
          ].map((m) => (
            <label
              key={m.id}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                paymentMethod === m.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary font-bold"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.id}
                checked={paymentMethod === m.id}
                onChange={() => setPaymentMethod(m.id as any)}
                className="sr-only"
              />
              <p className="text-xs font-bold text-slate-900">{m.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
            </label>
          ))}
        </div>

        {paymentMethod === "TRANSFERENCIA" && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <Building2 className="w-4 h-4 text-primary" />
              <span>Datos bancarios para señar o abonar:</span>
            </div>
            <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Alias</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {businessInfo?.bankAlias || "CIRCUS.TOURS.MP"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(businessInfo?.bankAlias || "CIRCUS.TOURS.MP")}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                title="Copiar alias"
              >
                {copiedAlias ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {businessInfo?.bankCbu && (
              <p className="text-slate-600">
                <strong>CBU:</strong> <span className="font-mono">{businessInfo.bankCbu}</span>
              </p>
            )}
            <p className="text-slate-500 text-[11px]">
              Titular: {businessInfo?.bankHolder || "Circus Tours"}
            </p>
          </div>
        )}
      </div>

      {/* Summary Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-300">
          <span>{seatsCount}x Pasaje(s) {seatType}</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        {depositPrice && (
          <div className="flex justify-between items-center text-xs text-amber-300 pt-1 border-t border-white/10">
            <span>Monto de seña mínima para asegurar lugar:</span>
            <span className="font-bold">{formatPrice(depositPrice)}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-base sm:text-lg font-black pt-2 border-t border-white/10 text-white">
          <span>Total a pagar:</span>
          <span className="text-primary-ink bg-white px-3 py-0.5 rounded-lg text-slate-950 font-black">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 transition-all shadow-lg hover-lift flex items-center justify-center gap-2"
      >
        {loading ? (
          <span>Confirmando reserva...</span>
        ) : (
          <>
            <span>Confirmar y Generar Pasaje con QR</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}

