import NextLink from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export interface EventCardProps {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  imageUrl: string;
  categoryTag: string;
  date: Date | string;
  departureTime: string;
  departureLocation: string;
  price: number | string | { toString: () => string };
  totalCapacity?: number;
  type?: string;
}

export default function EventCard({
  slug,
  title,
  subtitle,
  description,
  imageUrl,
  categoryTag,
  date,
  departureTime,
  departureLocation,
  price,
  type = "EVENTO",
}: EventCardProps) {
  const detailUrl = type === "TURISMO" ? `/turismo/${slug}` : `/eventos/${slug}`;
  const formattedDate = formatDate(date, {
    day: "numeric",
    month: "short",
    weekday: "short",
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
            {categoryTag}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-extrabold bg-primary text-white shadow-md">
            {formatPrice(price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        {/* Date & Departure */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1 text-primary-ink">
            <Calendar className="w-3.5 h-3.5" />
            <span className="capitalize">{formattedDate}</span>
          </span>
          <span>·</span>
          <span>Salida {departureTime} hs</span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-medium text-slate-500 line-clamp-1 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Departure location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{departureLocation}</span>
        </div>

        {/* CTA Button */}
        <div className="pt-3 mt-auto">
          <NextLink
            href={detailUrl}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 group-hover:bg-primary hover:bg-primary-hover transition-colors shadow-sm"
          >
            <span>Ver salida & Reservar</span>
            <ArrowRight className="w-4 h-4" />
          </NextLink>
        </div>
      </div>
    </article>
  );
}
