import { prisma } from "@/lib/prisma";
import TurismoCard from "@/components/TurismoCard";
import { Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Turismo y Salidas Programadas | Circus Tours",
  description:
    "Excursiones y escapadas grupales con traslado. Salidas de turismo con fecha fija desde Córdoba: consultá disponibilidad y coordiná tu lugar online o por WhatsApp.",
};

export default async function TurismoPage() {
  let turismo: any[] = [];
  try {
    turismo = await prisma.event.findMany({
      where: { isActive: true, type: "TURISMO" },
      orderBy: { date: "asc" },
    });
  } catch (e) {
    console.error("Turismo fetch error:", e);
  }

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="surface-premium relative isolate overflow-hidden text-white -mt-20 pt-32 pb-16 px-4 sm:px-6">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1759064094990-914ec7f653e6?auto=format&fit=crop&w=2000&q=70"
            alt="Turismo y escapadas"
            className="h-full w-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-[#0b0f19]/85" />
        </div>

        <div className="max-w-6xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <Compass className="w-3.5 h-3.5" />
            Turismo
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Salidas y Escapadas
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
            Excursiones grupales con fecha fija. Reservás online, viajás con tu lugar asegurado y tu pasaje con QR.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {turismo.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {turismo.map((item) => (
              <TurismoCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <p className="text-slate-600 font-medium">
              No hay excursiones de turismo programadas en este momento. ¡Consultanos por salidas a medida!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
