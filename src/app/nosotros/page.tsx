import { prisma } from "@/lib/prisma";
import NextLink from "next/link";
import {
  ArrowLeftRight,
  HeartHandshake,
  MapPin,
  Bus,
  Headphones,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Nosotros | Circus Tours",
  description:
    "Somos de Córdoba y vivimos los recitales como vos. Traslados grupales en micros cama y semicama, cena previa y coordinación todo el viaje.",
};

export default async function NosotrosPage() {
  const business = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });

  const bentoCards = [
    {
      icon: ArrowLeftRight,
      title: "Ida y vuelta resuelta",
      desc: "Salimos desde puntos estratégicos de Córdoba y Villa María, te esperamos al finalizar el show y te traemos de regreso sin complicaciones.",
    },
    {
      icon: HeartHandshake,
      title: "Respuesta rápida",
      desc: "Atención personalizada por WhatsApp antes, durante y después del viaje. Nunca te quedás sin respuesta ni asistencia.",
    },
    {
      icon: MapPin,
      title: "Puntos de encuentro accesibles",
      desc: "Terminal de Córdoba, Patio Olmos y paradores céntricos sobre ruta para que te sumes desde donde te quede más cómodo.",
    },
    {
      icon: Bus,
      title: "Unidades cómodas",
      desc: "Micros de larga distancia doble piso, habilitados por CNRT, equipados con butacas Cama y Semicama, climatización y baño.",
    },
    {
      icon: Headphones,
      title: "Siempre conectados",
      desc: "Creamos un grupo de WhatsApp por viaje donde compartimos horarios, puntos de encuentro en el recital y fotos del grupo.",
    },
    {
      icon: Clock,
      title: "Cumplimos horarios",
      desc: "Planificamos los tiempos para llegar con holgura a la cena previa y que puedas ingresar al estadio sin correr ni hacer filas eternas.",
    },
    {
      icon: ShieldCheck,
      title: "Viajás tranquilo",
      desc: "Coordinadores experimentados con botiquín, seguro de pasajeros y pasajes electrónicos intransferibles con código QR.",
    },
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80",
      caption: "Viviendo la previa en comunidad",
    },
    {
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      caption: "Cena previa y amigos nuevos en cada salida",
    },
    {
      url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      caption: "Llegada al estadio y emoción en vivo",
    },
    {
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      caption: "Micros confortables para descansar al regreso",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="surface-premium relative isolate overflow-hidden text-white -mt-20 pt-32 pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=70"
            alt="Nosotros Circus Tours"
            className="h-full w-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-[#0b0f19]/85" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            Quiénes Somos
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Pasión por la música y los viajes en grupo
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Te llevamos a ver a tu banda favorita sin que tengas que pensar en nada más que disfrutarla.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="prose prose-lg text-slate-700 max-w-none space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Nuestra historia: de fanáticos a coordinadores
          </h2>
          <p className="leading-relaxed">
            Somos de Córdoba y vivimos los recitales con la misma intensidad que vos. Circus Tours nació con una idea muy simple: transformar el viaje a un show en parte de la fiesta, eliminando el estrés de manejar de noche, pagar estacionamientos imposibles o viajar incómodo.
          </p>
          <p className="leading-relaxed">
            A lo largo de los años viajamos a ver a gigantes de la música como Iron Maiden, AC/DC, Korn, Megadeth, BTS, Lali, Stray Kids, Robbie Williams, Wos y tantos otros. En cada salida compartimos cena previa en paradores emblemáticos, sorteos a bordo y la tranquilidad de tener un coordinador que te acompaña desde que subís al micro hasta que volvés a tu casa.
          </p>
        </div>

        {/* Bento Grid Features */}
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              ¿Por qué viajar con Circus Tours?
            </h3>
            <p className="text-sm text-slate-500">
              Cuidamos cada detalle para que tu única preocupación sea cantar tus canciones favoritas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {bentoCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary-ink flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{c.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="space-y-6 pt-12 border-t border-slate-200">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-ink">
              Comunidad Circus
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              El viaje también es parte de la experiencia
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group relative h-64 overflow-hidden rounded-2xl bg-slate-100 shadow-sm"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-xs font-semibold text-white">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sumate al próximo micro
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Consultá las fechas disponibles en nuestro calendario o mandanos un mensaje para grupos cerrados.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NextLink
              href="/eventos"
              className="px-6 py-3 rounded-full text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
            >
              <span>Ver eventos</span>
              <ArrowRight className="w-4 h-4 text-primary" />
            </NextLink>
            <NextLink
              href="/contacto"
              className="px-6 py-3 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              <span>Contactar al equipo</span>
            </NextLink>
          </div>
        </div>
      </section>
    </div>
  );
}
