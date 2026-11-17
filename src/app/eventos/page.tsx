import { prisma } from "@/lib/prisma";
import EventCard from "@/components/EventCard";
import { Sparkles, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Eventos y Viajes a Recitales | Circus Tours",
  description:
    "Calendario de recitales y eventos con traslado. Traslados grupales desde Córdoba y Villa María: elegí fecha, reservá online y viajá seguro.",
};

export default async function EventosPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      where: { isActive: true, type: "EVENTO" },
      orderBy: { date: "asc" },
    });
  } catch (e) {
    console.error("Events fetch error:", e);
  }

  return (
    <div className="flex flex-col">
      {/* Header Banner */}
      <section className="surface-premium relative isolate overflow-hidden text-white -mt-20 pt-32 pb-16 px-4 sm:px-6">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=2000&q=70"
            alt="Eventos y recitales"
            className="h-full w-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-[#0b0f19]/80" />
        </div>

        <div className="max-w-6xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <Calendar className="w-3.5 h-3.5" />
            Agenda Oficial
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Eventos & Recitales
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
            Asegurá tu lugar en los recitales más esperados del país. Traslados puntuales, cómodos y seguros para que solo te preocupes por cantar y disfrutar.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {events.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((evt) => (
              <EventCard key={evt.id} {...evt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <p className="text-slate-600 font-medium">
              No hay salidas programadas en este momento. ¡Consultanos por WhatsApp para próximas fechas!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
