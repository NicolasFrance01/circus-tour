import NextLink from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

interface FooterProps {
  businessName?: string;
  tagline?: string;
  description?: string;
  logoUrl?: string | null;
  addressCity?: string;
  mapsUrl?: string;
}

export default function Footer({
  businessName = "Circus Tours",
  tagline = "Te llevamos y te traemos.",
  description = "Traslados a eventos y excursiones a la costa desde Buenos Aires y Córdoba. Salidas con punto de encuentro, asiento asignado y pasaje con QR.",
  logoUrl,
  addressCity = "Córdoba",
  mapsUrl = "https://www.google.com/maps/search/?api=1&query=-32.022249%2C-63.969874",
}: FooterProps) {
  return (
    <footer className="relative surface-premium text-white mt-auto">
      {/* Top Accent Gradient Line */}
      <div className="bg-vibrant-gradient h-1 w-full" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 xl:max-w-[80rem]">
        {/* Brand Column */}
        <div className="space-y-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={businessName}
              className="h-auto max-h-16 w-auto max-w-[14rem] object-contain object-left"
            />
          ) : (
            <h3 className="text-2xl font-bold tracking-tight text-white">{businessName}</h3>
          )}
          <p className="text-sm font-semibold text-white/95 leading-relaxed">{tagline}</p>
          <p className="text-sm leading-relaxed text-slate-400 max-w-xs">{description}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors pt-2"
          >
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{addressCity}, Argentina</span>
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-300">Navegación</p>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li>
              <NextLink href="/" className="hover:text-white transition-colors">
                Inicio
              </NextLink>
            </li>
            <li>
              <NextLink href="/eventos" className="hover:text-white transition-colors">
                Eventos & Recitales
              </NextLink>
            </li>
            <li>
              <NextLink href="/turismo" className="hover:text-white transition-colors">
                Turismo & Salidas
              </NextLink>
            </li>
            <li>
              <NextLink href="/nosotros" className="hover:text-white transition-colors">
                Quiénes Somos
              </NextLink>
            </li>
            <li>
              <NextLink href="/contacto" className="hover:text-white transition-colors">
                Contacto & Ubicación
              </NextLink>
            </li>
          </ul>
        </div>

        {/* Info & Safety */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-300">Beneficios</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Micros de última generación</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Asientos asignados garantizados</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Pasaje 100% digital con código QR</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Coordinación permanente todo el viaje</span>
            </li>
          </ul>
        </div>

        {/* Call to action */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-semibold text-white">¿Tenés dudas sobre tu viaje?</p>
          <p className="text-xs text-slate-400">
            Escribinos directamente a nuestro WhatsApp oficial para atención inmediata.
          </p>
          <NextLink
            href="/contacto"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full transition-colors"
          >
            <span>Ir a contacto</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NextLink>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-400 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} {businessName}. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4">
            <NextLink href="/admin/login" className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Ingreso del equipo
            </NextLink>
            <span className="text-white/20">·</span>
            <span>Sistema de reservas para agencias</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

