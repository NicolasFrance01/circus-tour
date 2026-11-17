import NextLink from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export interface TurismoCardProps {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  imageUrl: string;
  categoryTag: string;
  date: Date | string;
  departureLocation: string;
  price: number | string | { toString: () => string };
}

export default function TurismoCard({
  slug,
  title,
  subtitle,
  description,
  imageUrl,
  categoryTag,
  date,
  departureLocation,
  price,
}: TurismoCardProps) {
  const formattedDate = formatDate(date, {
    day: "numeric",
    month: "long",
  });

  return (
    <article className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-slate-200/50 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />

      {/* Category Pill Tag */}
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md text-white border border-white/30">
          {categoryTag}
        </span>
      </div>

      {/* Price Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-extrabold bg-primary text-white shadow-lg">
          {formatPrice(price)}
        </span>
      </div>

      {/* Content overlay on bottom */}
      <div className="absolute inset-x-0 bottom-0 p-6 z-10 flex flex-col justify-end space-y-2.5 text-white">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Calendar className="w-3.5 h-3.5" />
          <span className="capitalize">{formattedDate}</span>
        </div>

        <h3 className="text-2xl font-extrabold tracking-tight leading-snug line-clamp-2">
          {title}
        </h3>

        {subtitle && (
          <p className="text-xs text-white/80 line-clamp-1">
            {subtitle}
          </p>
        )}

        <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-white/70 pt-1">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{departureLocation}</span>
        </div>

        <div className="pt-2">
          <NextLink
            href={`/turismo/${slug}`}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md"
          >
            <span>Ver detalles & Reservar</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </NextLink>
        </div>
      </div>
    </article>
  );
}
