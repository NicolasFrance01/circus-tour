import NextLink from "next/link";
import { prisma } from "@/lib/prisma";
import EventCard from "@/components/EventCard";
import TurismoCard from "@/components/TurismoCard";
import TestimonialSection from "@/components/TestimonialSection";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Bus,
  UtensilsCrossed,
  QrCode,
  Calendar,
  Compass,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let business = null;
  let events: any[] = [];
  let turismo: any[] = [];
  let testimonials: any[] = [];

  try {
    business = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    events = await prisma.event.findMany({
      where: { isActive: true, type: "EVENTO" },
      orderBy: { date: "asc" },
      take: 6,
    });

    turismo = await prisma.event.findMany({
      where: { isActive: true, type: "TURISMO" },
      orderBy: { date: "asc" },
      take: 3,
    });

    testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 4,
    });
  } catch (error) {
    console.error("Home page data fetch error:", error);
  }

  const heroImage =
    business?.heroImage ||
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=2000&q=80";

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative surface-premium isolate overflow-hidden text-white -mt-20 pt-32 pb-24 md:pb-36 px-4 sm:px-6">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <img
            src={heroImage}
            alt="Circus Tours recitales"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0b0f19]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/40 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md text-amber-300 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Salidas desde Córdoba y Villa María</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Te llevamos y te traemos a los mejores recitales
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-200/90 max-w-2xl mx-auto font-normal leading-relaxed">
            Micros cama y semicama, cena previa incluida, coordinación todo el viaje y tu pasaje asegurado con código QR.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <NextLink
              href="/eventos"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-extrabold text-white bg-primary hover:bg-primary-hover shadow-xl hover-lift transition-all flex items-center justify-center gap-2.5"
            >
              <span>Ver próximas salidas</span>
              <ArrowRight className="w-5 h-5" />
            </NextLink>

            <NextLink
              href="/turismo"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Turismo & Escapadas</span>
            </NextLink>
          </div>

          {/* Trust stats pill bar */}
          <div className="pt-10 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Bus className="w-5 h-5 text-primary mb-1.5" />
              <p className="text-base font-extrabold text-white">Micros Premium</p>
              <p className="text-[11px] text-slate-300">Cama y semicama con aire</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <UtensilsCrossed className="w-5 h-5 text-amber-400 mb-1.5" />
              <p className="text-base font-extrabold text-white">Cena Previa</p>
              <p className="text-[11px] text-slate-300">Encuentro y comida incluida</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <QrCode className="w-5 h-5 text-emerald-400 mb-1.5" />
              <p className="text-base font-extrabold text-white">Pasaje con QR</p>
              <p className="text-[11px] text-slate-300">Embarque rápido en el cel</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-cyan-400 mb-1.5" />
              <p className="text-base font-extrabold text-white">Seguridad 100%</p>
              <p className="text-[11px] text-slate-300">Coordinador permanente</p>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING CONCERTS & EVENTS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-ink bg-primary/10 px-3 py-1 rounded-full">
              Agenda de Recitales
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Próximas salidas confirmadas
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Reservá online tu lugar en los mejores conciertos del país. Salidas aseguradas con punto de encuentro.
            </p>
          </div>

          <NextLink
            href="/eventos"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors shrink-0 group"
          >
            <span>Ver todos los eventos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NextLink>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((evt) => (
              <EventCard key={evt.id} {...evt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No hay eventos activos en este momento.</p>
          </div>
        )}
      </section>

      {/* TURISMO & ESCAPADAS SECTION */}
      {turismo.length > 0 && (
        <section className="py-20 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <Compass className="w-3.5 h-3.5" />
                  Turismo & Escapadas
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
                  Salidas grupales programadas
                </h2>
                <p className="text-sm text-slate-400 mt-1 max-w-xl">
                  Viajes de fin de semana, escapadas a la costa y excursiones por las sierras con todo organizado.
                </p>
              </div>

              <NextLink
                href="/turismo"
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0 group"
              >
                <span>Ver todas las escapadas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </NextLink>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {turismo.map((item) => (
                <TurismoCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <TestimonialSection testimonials={testimonials} />

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-primary to-rose-900 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            ¿Listo para vivir tu próximo recital?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
            No te preocupes por el viaje, el estacionamiento ni el regreso. Nosotros te llevamos, te esperamos y te traemos seguro.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <NextLink
              href="/eventos"
              className="px-8 py-4 rounded-full text-base font-extrabold text-slate-900 bg-white hover:bg-slate-100 shadow-xl hover-lift transition-all inline-flex items-center gap-2"
            >
              <span>Elegir mi próximo viaje</span>
              <ArrowRight className="w-5 h-5 text-primary" />
            </NextLink>
            <NextLink
              href="/contacto"
              className="px-8 py-4 rounded-full text-base font-bold text-white bg-black/20 hover:bg-black/30 border border-white/30 transition-all"
            >
              <span>Consultar por WhatsApp</span>
            </NextLink>
          </div>
        </div>
      </section>
    </div>
  );
}
