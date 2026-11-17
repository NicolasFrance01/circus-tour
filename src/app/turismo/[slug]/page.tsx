import { notFound } from "next/navigation";
import NextLink from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import BookingForm from "@/components/BookingForm";
import {
  Calendar,
  Clock,
  MapPin,
  Bus,
  CheckCircle2,
  ArrowLeft,
  Compass,
  UtensilsCrossed,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) return { title: "Salida no encontrada" };

  return {
    title: `${event.title} | Circus Tours Turismo`,
    description: event.description,
  };
}

export default async function TurismoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      pickupPoints: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const business = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });

  let includesList: string[] = [];
  try {
    includesList = JSON.parse(event.includes);
  } catch {
    includesList = [
      "Traslado ida y vuelta",
      "Coordinación permanente",
      "Pasaje digital con QR",
    ];
  }

  const formattedDate = formatDate(event.date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col pb-20">
      {/* Hero */}
      <section className="surface-premium relative isolate overflow-hidden text-white -mt-20 pt-32 pb-16 px-4 sm:px-6">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-[#0b0f19]/85" />
        </div>

        <div className="max-w-6xl mx-auto space-y-4">
          <NextLink
            href="/turismo"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a turismo</span>
          </NextLink>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-white/20">
              <Compass className="w-3.5 h-3.5" />
              {event.categoryTag}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 text-white">
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="text-base sm:text-lg text-slate-300 mt-1">
                {event.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Calendar className="w-4 h-4 text-primary mb-1" />
              <p className="text-xs text-slate-500 font-medium">Salida</p>
              <p className="text-sm font-bold text-slate-900 capitalize">
                {formattedDate}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Clock className="w-4 h-4 text-primary mb-1" />
              <p className="text-xs text-slate-500 font-medium">Horario</p>
              <p className="text-sm font-bold text-slate-900">
                {event.departureTime} hs
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
              <Bus className="w-4 h-4 text-primary mb-1" />
              <p className="text-xs text-slate-500 font-medium">Transporte</p>
              <p className="text-sm font-bold text-slate-900 truncate">
                {event.busType}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">Detalles de la escapada</h2>
            <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              <span>Servicios incluidos</span>
            </h3>
            <ul className="space-y-2.5 pt-1">
              {includesList.map((inc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <BookingForm
              event={{
                id: event.id,
                title: event.title,
                slug: event.slug,
                price: event.price,
                depositPrice: event.depositPrice,
                busType: event.busType,
                pickupPoints: event.pickupPoints,
              }}
              businessInfo={{
                bankAlias: business?.bankAlias,
                bankCbu: business?.bankCbu,
                bankHolder: business?.bankHolder,
                whatsapp: business?.whatsapp,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
