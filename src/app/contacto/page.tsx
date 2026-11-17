import { prisma } from "@/lib/prisma";
import { MessageCircle, Phone, Instagram, MapPin, Mail, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Contacto | Circus Tours",
  description:
    "Contacto Circus Tours en Córdoba: WhatsApp, teléfono e Instagram para consultas sobre traslados a recitales y reservas.",
};

export default async function ContactoPage() {
  const business = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });

  const phone = business?.phone || "5493516703575";
  const cleanPhone = phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;
  const instagram = business?.instagram || "circustourscordoba";
  const instagramUrl = instagram.startsWith("http")
    ? instagram
    : `https://instagram.com/${instagram.replace("@", "")}`;

  return (
    <div className="flex flex-col pb-20">
      {/* Hero Header */}
      <section className="surface-premium relative isolate overflow-hidden text-white -mt-20 pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Atención Directa
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
            Contactanos
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
            ¿Tenés dudas sobre un viaje o querés coordinar una salida para tu grupo? Escribinos por el canal que prefieras y te respondemos en minutos.
          </p>
        </div>
      </section>

      {/* Channels Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 space-y-12 w-full">
        <div className="grid md:grid-cols-3 gap-6">
          {/* WhatsApp Card - Highlighted */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="md:col-span-2 p-8 rounded-3xl bg-emerald-600 text-white shadow-xl hover:bg-emerald-700 transition-all hover-lift flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-100">
                  Canal Principal Recomendado
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                  Chateá por WhatsApp
                </h3>
                <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
                  Consultas rápidas, disponibilidad en tiempo real, confirmación de pagos y coordinación de paradas.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-white/20 flex items-center justify-between text-sm font-bold">
              <span>Abrir chat de WhatsApp</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </a>

          {/* Instagram & Phone Column */}
          <div className="space-y-6 flex flex-col">
            {/* Phone */}
            <a
              href={`tel:${cleanPhone}`}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all hover-lift flex-1 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-ink flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Llamanos</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Atención telefónica directa</p>
                  <p className="text-sm font-mono font-bold text-slate-900 mt-2">
                    +{phone}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary group-hover:underline pt-2">
                Llamar ahora →
              </span>
            </a>

            {/* Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all hover-lift flex-1 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Instagram</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Fotos, videos y novedades</p>
                  <p className="text-sm font-semibold text-slate-900 mt-2">
                    @{instagram.replace("@", "")}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-pink-600 group-hover:underline pt-2">
                Ver perfil →
              </span>
            </a>
          </div>
        </div>

        {/* Location & Map Section */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-ink">
                Punto Central
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Dónde estamos
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Córdoba Capital, Argentina. Salidas habituales desde Terminal de Ómnibus y Patio Olmos.
              </p>
            </div>

            <a
              href={business?.mapsUrl || "https://www.google.com/maps"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors inline-flex items-center gap-2 self-start"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span>Ver en Google Maps</span>
            </a>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="h-80 w-full overflow-hidden rounded-3xl border border-slate-200 shadow-sm bg-slate-100">
            <iframe
              title="Ubicación Circus Tours"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=-32.022249,-63.969874&z=15&output=embed"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
