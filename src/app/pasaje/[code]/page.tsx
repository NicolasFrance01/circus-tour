import { notFound } from "next/navigation";
import QRCode from "qrcode";
import NextLink from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Share2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return {
    title: `Pasaje Digital ${code} | Circus Tours`,
    description: `Pasaje y tarjeta de embarque digital con código QR para Circus Tours.`,
  };
}

export default async function PasajePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { ticketCode: code },
    include: {
      event: true,
      pickupPoint: true,
    },
  });

  if (!reservation) {
    notFound();
  }

  const business = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });

  // Generate live QR
  const host = process.env.NEXT_PUBLIC_APP_URL || "https://circus-tour.vercel.app";
  const validationUrl = `${host}/pasaje/${reservation.ticketCode}`;
  const qrDataUrl = await QRCode.toDataURL(validationUrl, {
    width: 320,
    margin: 2,
    color: {
      dark: "#0b0f19",
      light: "#ffffff",
    },
  });

  const formattedDate = formatDate(reservation.event.date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <NextLink
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </NextLink>

          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-light bg-primary px-3 py-1 rounded-full">
            Pasaje Digital
          </span>
        </div>

        {/* Boarding Pass Card */}
        <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          {/* Top header */}
          <div className="bg-primary text-white p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/80">
                  {business?.name || "Circus Tours"}
                </p>
                <h1 className="text-2xl font-black tracking-tight mt-1">
                  Tarjeta de Embarque
                </h1>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-white/70 block">
                  Código
                </span>
                <span className="font-mono text-xl font-black text-amber-300">
                  {reservation.ticketCode}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-xs">
              <span className="font-semibold text-white/90">
                Titular: {reservation.customerName}
              </span>
              <span className="font-mono text-white/80">
                DNI: {reservation.customerDni}
              </span>
            </div>
          </div>

          {/* Event info */}
          <div className="p-6 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-ink bg-primary/10 px-2.5 py-0.5 rounded-md">
                {reservation.event.categoryTag}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                {reservation.event.title}
              </h2>
              {reservation.event.subtitle && (
                <p className="text-xs text-slate-500 font-medium">
                  {reservation.event.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Fecha
                </span>
                <p className="font-bold text-slate-800 capitalize">
                  {formattedDate}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Horario de Salida
                </span>
                <p className="font-bold text-slate-800">
                  {reservation.pickupPoint?.time || reservation.event.departureTime} hs
                </p>
              </div>
            </div>

            <div className="space-y-1 text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Punto de Embarque
              </span>
              <p className="font-bold text-slate-800">
                {reservation.pickupPoint?.name || reservation.event.departureLocation}
              </p>
              {reservation.pickupPoint?.address && (
                <p className="text-slate-500 text-[11px]">
                  {reservation.pickupPoint.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 font-medium block">Butaca</span>
                <p className="font-bold text-slate-800">
                  {reservation.seatsCount}x {reservation.seatType}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Estado</span>
                <span
                  className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-full ${
                    reservation.paymentStatus === "PAGADO"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {reservation.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-slate-50 p-6 border-t-2 border-dashed border-slate-200 text-center space-y-3">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 inline-block">
              <img
                src={qrDataUrl}
                alt={`Código QR para el pasaje ${reservation.ticketCode}`}
                className="w-48 h-48 mx-auto"
              />
            </div>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Presentá este código QR en la pantalla de tu celular al coordinador antes de abordar el micro.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 space-y-2">
          <p className="flex items-center justify-center gap-1 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pasaje verificado electrónicamente por {business?.name || "Circus Tours"}</span>
          </p>
          <p>
            ¿Consultas? Escribinos por WhatsApp al{" "}
            <a
              href={`https://wa.me/${business?.whatsapp || "5493516703575"}`}
              className="text-primary-light underline font-bold"
            >
              +{business?.whatsapp || "5493516703575"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
