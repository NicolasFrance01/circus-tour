import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  text: string;
  authorName: string;
  authorOrigin: string;
  rating: number;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary-ink">
            Experiencias Reales
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Lo que dicen quienes ya viajaron
          </h2>
          <p className="text-base text-slate-600">
            Cientos de pasajeros eligen viajar con Circus Tours a los eventos y recitales más importantes del país.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => {
            const initials = t.authorName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            return (
              <div
                key={t.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <Quote className="w-8 h-8 text-primary/15 absolute top-4 right-4" />

                <div className="space-y-3">
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    “{t.text}”
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs bg-primary/15 text-primary-ink shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {t.authorName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {t.authorOrigin}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

